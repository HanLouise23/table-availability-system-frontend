import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import RestaurantDetails from "~/components/RestaurantDetails";
import type { Restaurant } from "~/types";

// Mock the booking service
jest.mock("~/services/restaurants", () => ({
  bookTable: jest.fn(async () => {}),
}));
import { bookTable } from "~/services/restaurants";

const makeRestaurant = (overrides: Partial<Restaurant> = {}): Restaurant => ({
  id: 123,
  name: "Cafe Test",
  address: { line_1: "1 St", city: "Town", postcode: "AB1 2CD" },
  contact: { phone: "01234 567890", email: "a@b.com" },
  rating: 4.1,
  mainImageUrl: "/img/a.jpg",
  imageUrls: ["/img/b.jpg", "/img/c.jpg"], // 3 images total
  tables: [
    { table_id: 1, seats: 2, booked_by: null, phone_number: null },
    { table_id: 2, seats: 4, booked_by: null, phone_number: null },
  ],
  ...overrides,
});

describe("RestaurantDetails – UI interactions", () => {
  it("cycles the hero image with Next/Previous and thumbnails", async () => {
    render(<RestaurantDetails restaurant={makeRestaurant()} desiredSeats={2} />);

    // initial hero
    expect(screen.getByAltText(/cafe test photo 1/i)).toBeInTheDocument();

    // next -> photo 2
    await userEvent.click(screen.getByRole("button", { name: /next slide/i }));
    expect(screen.getByAltText(/cafe test photo 2/i)).toBeInTheDocument();

    // next -> photo 3
    await userEvent.click(screen.getByRole("button", { name: /next slide/i }));
    expect(screen.getByAltText(/cafe test photo 3/i)).toBeInTheDocument();

    // next wraps -> photo 1
    await userEvent.click(screen.getByRole("button", { name: /next slide/i }));
    expect(screen.getByAltText(/cafe test photo 1/i)).toBeInTheDocument();

    // previous wraps -> photo 3
    await userEvent.click(screen.getByRole("button", { name: /previous slide/i }));
    expect(screen.getByAltText(/cafe test photo 3/i)).toBeInTheDocument();

    // click thumbnail button "Show slide 2"
    await userEvent.click(screen.getByRole("button", { name: /show slide 2/i }));
    expect(screen.getByAltText(/cafe test photo 2/i)).toBeInTheDocument();
  });

  it("opens the form, focuses the table select, and preselects the recommended table", async () => {
    // desiredSeats=3 -> smallest table >=3 is table_id=2 (4 seats)
    render(<RestaurantDetails restaurant={makeRestaurant()} desiredSeats={3} />);

    await userEvent.click(screen.getByRole("button", { name: /book a table/i }));

    const select = screen.getByLabelText(/table/i) as HTMLSelectElement;
    expect(select).toHaveFocus();
    expect(select.value).toBe("2"); // recommended preselected
  });

  it("requires selecting a table when there is no recommendation (desiredSeats undefined)", async () => {
    (bookTable as jest.Mock).mockClear();
    render(<RestaurantDetails restaurant={makeRestaurant()} />); // no desiredSeats -> no preselect

    await userEvent.click(screen.getByRole("button", { name: /book a table/i }));

    // ensure nothing selected
    const select = screen.getByLabelText(/table/i) as HTMLSelectElement;
    expect(select.value).toBe("");

    // fill valid name + phone, attempt submit without selecting a table
    await userEvent.type(screen.getByLabelText(/your name/i), "Alice");
    await userEvent.type(screen.getByLabelText(/phone number/i), "07123456789");
    // Submit programmatically to bypass native 'required' blocking in jsdom
    const submitBtn = screen.getByRole("button", { name: /^book$/i });
    const form = submitBtn.closest("form")!;
    fireEvent.submit(form);

    // inline error appears; no network call
    const alert = await screen.findByRole("alert");
    expect(alert).toHaveTextContent(/please select a table/i);
    expect(bookTable).not.toHaveBeenCalled();
  });

  it("hides the form when Cancel is clicked", async () => {
    render(<RestaurantDetails restaurant={makeRestaurant()} desiredSeats={2} />);

    await userEvent.click(screen.getByRole("button", { name: /book a table/i }));
    // cancel
    await userEvent.click(screen.getByRole("button", { name: /cancel/i }));

    // form is gone; primary trigger visible again
    expect(screen.getByRole("button", { name: /book a table/i })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /^book$/i })).not.toBeInTheDocument();
  });
});
