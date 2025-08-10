import React, { useEffect, useRef, useState } from "react";
import { useOutletContext } from "react-router-dom";
import type { Restaurant } from "../models/Restaurant";
import RestaurantCard from "../components/RestaurantCard";

type Ctx = { location: string; tableCount: number };

export default function HomeRoute() {
  const { location, tableCount } = useOutletContext<Ctx>();
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
      has_tables: "true",
      min_seats: tableCount.toString(),
    });

    fetch(`http://localhost:8000/restaurants?${params}`, { signal: controller.signal })
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((data: Restaurant[]) => {
        setRestaurants(data);
      })
      .catch((err) => {
        if ((err as any).name !== "AbortError") {
          console.error("Fetch error:", err);
          // Keep old results on error
        }
      })
      .finally(() => {
        setIsFetching(false);
      });

    return () => controller.abort();
  }, [location, tableCount]);

  const showNoResults =
    !isFetching && location.trim().length >= 3 && restaurants.length === 0;

  return (
    <>
      {/* No loading text -> prevents flicker */}
      {showNoResults && <p>No matching restaurants found.</p>}
      {restaurants.map((r) => (
        <RestaurantCard key={r.id} restaurant={r} />
      ))}
    </>
  );
}
