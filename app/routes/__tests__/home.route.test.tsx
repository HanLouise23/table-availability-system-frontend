import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import {
  MemoryRouter,
  Routes,
  Route,
  Outlet,
} from "react-router-dom";
import HomeRoute from "~/routes/home";
import type { Restaurant } from "~/types";

// Mock the service
jest.mock("~/services/restaurants", () => ({
  searchRestaurants: jest.fn(),
}));
import { searchRestaurants } from "~/services/restaurants";

const makeRestaurant = (id: number, name: string): Restaurant => ({
  id,
  name,
  address: { line_1: "1 St", city: "Town", postcode: "AB1 2CD" },
  contact: { phone: "01234 567890", email: "a@b.com" },
  tables: [{ table_id: 7, seats: 2, booked_by: null, phone_number: null }],
  mainImageUrl: "/img/a.jpg",
  imageUrls: [],
  rating: 3.5,
});

function renderWithCtx(ctx: { location: string; tableCount: number }) {
  return render(
    <MemoryRouter initialEntries={["/"]}>
      <Routes>
        {/* Parent outlet provides the context */}
        <Route element={<Outlet context={ctx} />}>
          <Route index element={<HomeRoute />} />
        </Route>
      </Routes>
    </MemoryRouter>
  );
}

describe("Home route", () => {
  beforeEach(() => {
    (searchRestaurants as jest.Mock).mockReset();
  });

  it("does not fetch when location has fewer than 3 characters", () => {
    (searchRestaurants as jest.Mock).mockResolvedValue([]);
    renderWithCtx({ location: "Lo", tableCount: 2 });
    expect(searchRestaurants).not.toHaveBeenCalled();
    // No “no results” message either because query is too short
    expect(screen.queryByText(/no matching restaurants/i)).not.toBeInTheDocument();
  });

  it("fetches and renders results when location has 3+ characters", async () => {
    const data = [makeRestaurant(1, "Alpha Café"), makeRestaurant(2, "Beta Bistro")];
    (searchRestaurants as jest.Mock).mockResolvedValue(data);

    renderWithCtx({ location: "Lon", tableCount: 2 });

    // Assert params passed to the service
    await waitFor(() => expect(searchRestaurants).toHaveBeenCalled());
    const [params] = (searchRestaurants as jest.Mock).mock.calls[0];
    expect(params.get("location")).toBe("Lon");
    expect(params.get("min_seats")).toBe("2");

    // Cards rendered
    expect(await screen.findByText(/alpha café/i)).toBeInTheDocument();
    expect(screen.getByText(/beta bistro/i)).toBeInTheDocument();
  });

  it('shows "No matching restaurants found." when 3+ chars and empty results', async () => {
    (searchRestaurants as jest.Mock).mockResolvedValue([]);
    renderWithCtx({ location: "York", tableCount: 2 });

    expect(await screen.findByText(/no matching restaurants found/i)).toBeInTheDocument();
  });

  it("aborts the previous request when inputs change", async () => {
    const signals: AbortSignal[] = [];

    (searchRestaurants as jest.Mock)
      // first call: never resolves
      .mockImplementationOnce((_p: URLSearchParams, signal: AbortSignal) => {
        signals.push(signal);
        return new Promise<Restaurant[]>(() => {});
      })
      // second call: resolves
      .mockImplementationOnce((_p: URLSearchParams, signal: AbortSignal) => {
        signals.push(signal);
        return Promise.resolve([makeRestaurant(3, "Gamma Grill")]);
      });

    // First render triggers call #1
    const { rerender } = render(
      <MemoryRouter initialEntries={["/"]}>
        <Routes>
          <Route element={<Outlet context={{ location: "Lon", tableCount: 2 }} />}>
            <Route index element={<HomeRoute />} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    // Rerender with updated context triggers call #2 and should abort #1
    rerender(
      <MemoryRouter initialEntries={["/"]}>
        <Routes>
          <Route element={<Outlet context={{ location: "Lond", tableCount: 2 }} />}>
            <Route index element={<HomeRoute />} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(searchRestaurants).toHaveBeenCalledTimes(2);
      expect(signals[0].aborted).toBe(true); // previous request aborted
    });

    expect(await screen.findByText(/gamma grill/i)).toBeInTheDocument();
  });

  it("keeps previous results visible when query becomes shorter than 3", async () => {
    // initial results for "Leed"
    (searchRestaurants as jest.Mock).mockResolvedValue([makeRestaurant(9, "Delta Diner")]);

    const { rerender } = render(
      <MemoryRouter initialEntries={["/"]}>
        <Routes>
          <Route element={<Outlet context={{ location: "Leed", tableCount: 2 }} />}>
            <Route index element={<HomeRoute />} />
          </Route>
        </Routes>
      </MemoryRouter>
    );
    expect(await screen.findByText(/delta diner/i)).toBeInTheDocument();

    (searchRestaurants as jest.Mock).mockClear();

    // Now drop to <3 chars; should NOT refetch and should keep previous card
    rerender(
      <MemoryRouter initialEntries={["/"]}>
        <Routes>
          <Route element={<Outlet context={{ location: "Le", tableCount: 2 }} />}>
            <Route index element={<HomeRoute />} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText(/delta diner/i)).toBeInTheDocument();
    expect(searchRestaurants).not.toHaveBeenCalled();
    // also no “no results” message since query is too short
    expect(screen.queryByText(/no matching restaurants/i)).not.toBeInTheDocument();
  });
});
