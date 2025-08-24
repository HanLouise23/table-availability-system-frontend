import type { Restaurant } from "~/types";

// Mock the module that `restaurants.ts` imports
jest.mock("~/services/api", () => ({
  apiFetch: jest.fn(),
}));

import { apiFetch } from "~/services/api";
import {
  searchRestaurants,
  getRestaurant,
  bookTable,
} from "~/services/restaurants";

describe("services/restaurants", () => {
  beforeEach(() => {
    (apiFetch as jest.Mock).mockReset();
  });

  it("searchRestaurants builds the query string and forwards the signal", async () => {
    const controller = new AbortController();

    const qs = new URLSearchParams();
    qs.set("location", "Leeds");
    qs.set("min_seats", "4");

    const fake: Restaurant[] = [
      {
        id: 1,
        name: "A",
        address: { line_1: "1 St", city: "Leeds", postcode: "LS1 1AA" },
        contact: { phone: "01234 567890", email: "a@b.com" },
        tables: [{ table_id: 1, seats: 2, booked_by: null, phone_number: null }],
        mainImageUrl: "/img/a.jpg",
        imageUrls: [],
        rating: 4.2,
      },
    ];
    (apiFetch as jest.Mock).mockResolvedValueOnce(fake);

    const result = await searchRestaurants(qs, controller.signal);

    expect(result).toBe(fake);
    expect(apiFetch).toHaveBeenCalledTimes(1);

    const [path, init] = (apiFetch as jest.Mock).mock.calls[0];
    expect(path).toBe(`/restaurants?location=Leeds&min_seats=4`);
    expect(init).toEqual({ signal: controller.signal });
  });

  it("getRestaurant calls /restaurants/:id with the provided signal", async () => {
    const controller = new AbortController();

    const fake: Restaurant = {
      id: 42,
      name: "Bistro",
      address: { line_1: "2 Rd", city: "Town", postcode: "AB1 2CD" },
      contact: { phone: "01234 567890", email: "b@c.com" },
      tables: [{ table_id: 7, seats: 4, booked_by: null, phone_number: null }],
      mainImageUrl: "/img/b.jpg",
      imageUrls: [],
      rating: 3.9,
    };
    (apiFetch as jest.Mock).mockResolvedValueOnce(fake);

    const result = await getRestaurant(42, controller.signal);

    expect(result).toBe(fake);
    expect(apiFetch).toHaveBeenCalledTimes(1);

    const [path, init] = (apiFetch as jest.Mock).mock.calls[0];
    expect(path).toBe(`/restaurants/42`);
    expect(init).toEqual({ signal: controller.signal });
  });

  it("bookTable posts JSON to the correct endpoint with the provided signal", async () => {
    const controller = new AbortController();
    (apiFetch as jest.Mock).mockResolvedValueOnce(undefined);

    const body = { name: "Alice", phone_number: "07123456789" };

    const result = await bookTable(5, 12, body, controller.signal);

    expect(result).toBeUndefined();
    expect(apiFetch).toHaveBeenCalledTimes(1);

    const [path, init] = (apiFetch as jest.Mock).mock.calls[0];
    expect(path).toBe(`/restaurants/5/tables/12/book`);
    expect(init).toMatchObject({
      method: "POST",
      body: JSON.stringify(body),
      signal: controller.signal,
    });
  });
});
