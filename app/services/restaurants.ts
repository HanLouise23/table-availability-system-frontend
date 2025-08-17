import type { Restaurant } from "../models/Restaurant";
import { apiFetch } from "./api";

export function searchRestaurants(qs: URLSearchParams, signal?: AbortSignal) {
  return apiFetch<Restaurant[]>(`/restaurants?${qs.toString()}`, { signal });
}

export function getRestaurant(id: string | number, signal?: AbortSignal) {
  return apiFetch<Restaurant>(`/restaurants/${id}`, { signal });
}

export function bookTable(
  restaurantId: number,
  tableId: number,
  body: { name: string; phone_number: string },
  signal?: AbortSignal
) {
  return apiFetch<void>(`/restaurants/${restaurantId}/tables/${tableId}/book`, {
    method: "POST",
    body: JSON.stringify(body),
    signal,
  });
}