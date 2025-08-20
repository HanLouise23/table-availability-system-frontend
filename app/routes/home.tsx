import React, { useEffect, useState, useRef } from "react";
import { useOutletContext } from "react-router-dom";
import type { Restaurant, SearchContext } from "~/types";
import RestaurantCard from "../components/RestaurantCard";
import { searchRestaurants } from "../services/restaurants";

type Ctx = { location: string; tableCount: number };

export default function HomeRoute() {
  const { location, tableCount } = useOutletContext<SearchContext>();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [isFetching, setIsFetching] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const trimmed = location.trim();

    // Only fetch when 3+ chars. Keep old results visible to avoid flicker.
    if (trimmed.length < 3) {
      // Do NOT clear restaurants here — keeps previous results displayed.
      setIsFetching(false);
      // Cancel any in-flight request
      abortRef.current?.abort();
      return;
    }

    // Cancel any in-flight request when inputs change
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setIsFetching(true);

    const params = new URLSearchParams({
      location: trimmed,
      min_seats: tableCount.toString(),
    });

    searchRestaurants(params, controller.signal)
      .then((data) => setRestaurants(data))
      .catch((err) => {
        if ((err as any).name !== "AbortError") {
          console.error("Fetch error:", err);
        }
      })
      .finally(() => setIsFetching(false));

    return () => controller.abort();
  }, [location, tableCount]);

  const showNoResults =
    !isFetching && location.trim().length >= 3 && restaurants.length === 0;

  return (
    <>
      {showNoResults && <p>No matching restaurants found.</p>}
      {restaurants.map((r) => (
        <RestaurantCard key={r.id} restaurant={r} />
      ))}
    </>
  );
}
