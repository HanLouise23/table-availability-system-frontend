import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import type { Restaurant } from "../models/Restaurant";
import RestaurantCard from "../components/RestaurantCard";

type Ctx = { location: string; tableCount: number };

export default function HomeRoute() {
  const { location, tableCount } = useOutletContext<Ctx>();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!location.trim()) {
      setRestaurants([]);
      return;
    }

    const params = new URLSearchParams({
      location,
      has_tables: "true",
      min_seats: tableCount.toString(),
    });

    setLoading(true);
    fetch(`http://localhost:8000/restaurants?${params}`)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then(setRestaurants)
      .catch(() => setRestaurants([]))
      .finally(() => setLoading(false));
  }, [location, tableCount]);

  return (
    <>
      {loading && <p>Loading...</p>}
      {!loading && restaurants.length === 0 && location && <p>No matching restaurants found.</p>}
      {!loading && restaurants.map((r) => <RestaurantCard key={r.id} restaurant={r} />)}
    </>
  );
}
