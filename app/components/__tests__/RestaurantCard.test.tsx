import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import RestaurantCard from "~/components/RestaurantCard";
import type { Restaurant } from "~/types";

const makeRestaurant = (overrides: Partial<Restaurant> = {}): Restaurant => ({
  id: 42,
  name: "Chez Test",
  address: { line_1: "10 Test St", city: "Teston", postcode: "T35 7AB" },
  contact: { phone: "01234 000000", email: "test@example.com" },
  tables: [
    { table_id: 1, seats: 2, booked_by: null, phone_number: null },
    { table_id: 2, seats: 4, booked_by: "Alice", phone_number: "07123 456789" },
    { table_id: 3, seats: 2, booked_by: null, phone_number: null },
  ],
  mainImageUrl: "/img/r1.jpg",
  imageUrls: ["/img/r1b.jpg"],
  rating: 4.2,
  ...overrides,
});

describe("RestaurantCard", () => {
  it("renders image and title that both link to the details page", () => {
    const r = makeRestaurant();
    render(
      <MemoryRouter>
        <RestaurantCard restaurant={r} />
      </MemoryRouter>
    );

    // Both image (via alt text) and title should link to the details route
    const links = screen.getAllByRole("link", { name: r.name });
    expect(links).toHaveLength(2);
    for (const a of links) {
      expect(a).toHaveAttribute("href", `/restaurants/${r.id}`);
    }

    // Image alt text should be the restaurant name
    const img = screen.getByRole("img", { name: r.name });
    expect(img).toHaveAttribute("src", r.mainImageUrl);
  });

  it("shows address, rating label, and available table count", () => {
    const r = makeRestaurant();
    render(
      <MemoryRouter>
        <RestaurantCard restaurant={r} />
      </MemoryRouter>
    );

    // Address text (allow flexible spacing)
    expect(screen.getByText(/10 Test St,\s*Teston,\s*T35 7AB/i)).toBeInTheDocument();

    // RatingStars exposes an accessible name via role="img"
    expect(
      screen.getByRole("img", { name: /rating of 4\.2 out of 5/i })
    ).toBeInTheDocument();

    // 2 tables are available (one is booked)
    expect(screen.getByText(/tables:\s*2/i)).toBeInTheDocument();
  });

  it("computes available tables when all are booked", () => {
    const r = makeRestaurant({
      tables: [{ table_id: 1, seats: 2, booked_by: "A", phone_number: "07123456789" }],
    });
    render(
      <MemoryRouter>
        <RestaurantCard restaurant={r} />
      </MemoryRouter>
    );

    expect(screen.getByText(/tables:\s*0/i)).toBeInTheDocument();
  });
});
