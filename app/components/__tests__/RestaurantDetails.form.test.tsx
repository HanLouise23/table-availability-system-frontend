import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import RestaurantDetails from "~/components/RestaurantDetails";
import type { Restaurant } from "~/types";

// Mock the service to avoid real network
jest.mock("~/services/restaurants", () => ({
  bookTable: jest.fn(async () => {}),
}));
import { bookTable } from "~/services/restaurants";

const baseRestaurant: Restaurant = {
  id: 1,
  name: "Cafe Test",
  address: { line_1: "1 St", city: "Town", postcode: "AB1 2CD" },
  contact: { phone: "01234 567890", email: "a@b.com" },
  tables: [{ table_id: 7, seats: 2, booked_by: null, phone_number: null }],
  mainImageUrl: "/img/a.jpg",
  imageUrls: ["/img/b.jpg"],
  rating: 3.4,
};

function openForm() {
  return userEvent.click(screen.getByRole("button", { name: /book a table/i }));
}

it("shows an inline error for short phone numbers and prevents submit", async () => {
  render(<RestaurantDetails restaurant={baseRestaurant} desiredSeats={2} />);
  await openForm();

  // Table is preselected by recommendation; if not, select it
  const tableSelect = screen.getByLabelText(/table/i);
  if ((tableSelect as HTMLSelectElement).value === "") {
    await userEvent.selectOptions(tableSelect, "7");
  }

  await userEvent.type(screen.getByLabelText(/your name/i), "Alice");
  await userEvent.type(screen.getByLabelText(/phone number/i), "07123"); // too short
  await userEvent.click(screen.getByRole("button", { name: /^book$/i }));

  const alert = await screen.findByRole("alert");
  expect(alert).toHaveTextContent(/please enter an 11[- ]?digit uk mobile number/i);
  expect(screen.getByLabelText(/phone number/i)).toHaveAttribute("aria-invalid", "true");

});

it("trims the name and submits 11-digit phone digits to the API", async () => {
  (bookTable as jest.Mock).mockClear();

  render(<RestaurantDetails restaurant={baseRestaurant} desiredSeats={2} />);
  await openForm();

  const tableSelect = screen.getByLabelText(/table/i);
  if ((tableSelect as HTMLSelectElement).value === "") {
    await userEvent.selectOptions(tableSelect, "7");
  }

  await userEvent.type(screen.getByLabelText(/your name/i), "  Bob  ");
  // User types with spaces; component cleans to 11 digits before submit
  await userEvent.type(screen.getByLabelText(/phone number/i), "07123 456 789");
  await userEvent.click(screen.getByRole("button", { name: /^book$/i }));

  expect(bookTable).toHaveBeenCalledWith(
    1,                            // restaurant id
    7,                            // selectedTableId
    { name: "Bob", phone_number: "07123456789" }, // trimmed & digits-only
    expect.any(AbortSignal)
  );
});

it("blocks submit when name is blank (whitespace only)", async () => {
  render(<RestaurantDetails restaurant={baseRestaurant} desiredSeats={2} />);
  await openForm();

  // ensure table is selected
  const tableSelect = screen.getByLabelText(/table/i);
  if ((tableSelect as HTMLSelectElement).value === "") {
    await userEvent.selectOptions(tableSelect, "7");
  }

  // enter whitespace name and a valid phone
  await userEvent.clear(screen.getByLabelText(/your name/i));
  await userEvent.type(screen.getByLabelText(/your name/i), "   ");
  await userEvent.type(screen.getByLabelText(/phone number/i), "07123456789");
  await userEvent.click(screen.getByRole("button", { name: /^book$/i }));

  const alert = await screen.findByRole("alert");
  expect(alert).toHaveTextContent(/enter your name/i);
  expect(bookTable).not.toHaveBeenCalled();
});
