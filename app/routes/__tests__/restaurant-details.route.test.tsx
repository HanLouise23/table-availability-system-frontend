import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  createMemoryRouter,
  RouterProvider,
  Outlet,
} from "react-router-dom";
import RestaurantDetailsRoute from "~/routes/restaurant-details";
import type { Restaurant } from "~/types";

// ===== Mock service layer =====
jest.mock("~/services/restaurants", () => ({
  getRestaurant: jest.fn(),
}));
import { getRestaurant } from "~/services/restaurants";

// ===== Stub child component so we can trigger onBooked easily =====
jest.mock("~/components/RestaurantDetails", () => {
  return function Stub(props: any) {
    return (
      <div data-testid="stub-details">
        <div>{props.restaurant?.name}</div>
        <button onClick={() => props.onBooked?.("Table X booked!")}>
          Trigger onBooked
        </button>
      </div>
    );
  };
});

const makeRestaurant = (overrides: Partial<Restaurant> = {}): Restaurant => ({
  id: 123,
  name: "Cafe Test",
  address: { line_1: "1 St", city: "Town", postcode: "AB1 2CD" },
  contact: { phone: "01234 567890", email: "a@b.com" },
  tables: [{ table_id: 7, seats: 2, booked_by: null, phone_number: null }],
  mainImageUrl: "/img/a.jpg",
  imageUrls: [],
  rating: 3.4,
  ...overrides,
});

// Helper to render the route with outlet context & programmatic navigation
function renderRoute(initialPath = "/restaurants/1", ctx = { location: "", tableCount: 4 }) {
  const routes = [
    {
      element: <Outlet context={ctx} />,
      children: [{ path: "/restaurants/:id", element: <RestaurantDetailsRoute /> }],
    },
  ];
  const router = createMemoryRouter(routes, { initialEntries: [initialPath] });
  render(<RouterProvider router={router} />);
  return router;
}

describe("RestaurantDetails route (id changes & banner)", () => {
  beforeEach(() => {
    (getRestaurant as jest.Mock).mockReset();
    jest.spyOn(console, "error").mockImplementation(() => {}); // silence expected errors
  });

  afterAll(() => {
    (console.error as jest.Mock).mockRestore?.();
  });

  it("aborts the previous request when the id changes (same router instance)", async () => {
    const signals: AbortSignal[] = [];

    (getRestaurant as jest.Mock)
      // first call never resolves (we’ll abort it)
      .mockImplementationOnce((_id: string, signal: AbortSignal) => {
        signals.push(signal);
        return new Promise(() => {});
      })
      // second call resolves
      .mockImplementationOnce((_id: string, signal: AbortSignal) => {
        signals.push(signal);
        return Promise.resolve(makeRestaurant({ name: "Beta Bistro" }));
      });

    const router = renderRoute("/restaurants/1");

    // ensure first effect fired
    await waitFor(() => expect(getRestaurant).toHaveBeenCalledTimes(1));

    // navigate to a different id within the same router (this will abort #1)
    await router.navigate("/restaurants/2");

    await waitFor(() => {
      expect(getRestaurant).toHaveBeenCalledTimes(2);
      expect(signals[0].aborted).toBe(true);
    });

    expect(await screen.findByText(/beta bistro/i)).toBeInTheDocument();
  });

  it("shows a success banner on onBooked, refetches, and hides after 3s", async () => {
    // Keep real timers until we need to auto-hide the banner
    (getRestaurant as jest.Mock).mockResolvedValue(makeRestaurant({ name: "Gamma Grill" }));
    const router = renderRoute("/restaurants/55");

    // initial fetch completes
    expect(await screen.findByText(/gamma grill/i)).toBeInTheDocument();

    // Observe only the refetch
    (getRestaurant as jest.Mock).mockClear();
    (getRestaurant as jest.Mock).mockResolvedValue(makeRestaurant({ name: "Gamma Grill" }));

    // fire onBooked via the stub
    await userEvent.click(screen.getByRole("button", { name: /trigger onbooked/i }));

    // banner appears
    const banner = await screen.findByRole("status");
    expect(banner).toHaveTextContent(/table x booked!/i);

    // refetch happens
    await waitFor(() => expect(getRestaurant).toHaveBeenCalledTimes(1));

    // Now switch to fake timers to test auto-hide fast
    jest.useFakeTimers();
    jest.advanceTimersByTime(3000);

    await waitFor(() =>
      expect(screen.queryByRole("status", { name: /table x booked!/i })).not.toBeInTheDocument()
    );

    // always restore timers for safety
    jest.useRealTimers();
  });
});
