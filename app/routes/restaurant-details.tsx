import React, { useEffect, useRef, useState } from "react";
import { useParams, useOutletContext } from "react-router-dom";
import type { Restaurant, SearchContext } from "~/types";
import RestaurantDetails from "../components/RestaurantDetails";
import { getRestaurant } from "../services/restaurants";

const API_BASE = "http://localhost:8000";

export default function RestaurantDetailsRoute() {
  const { id } = useParams();
  const { tableCount } = useOutletContext<SearchContext>()
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(false);
  const [banner, setBanner] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  async function fetchRestaurant() {
    if (!id) return;
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    try {
      const data = await getRestaurant(id, controller.signal);
      setRestaurant(data);
    } catch (e: any) {
      if (e?.name !== "AbortError") {
        console.error("Failed to fetch restaurant:", e);
        setRestaurant(null);
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchRestaurant();
    return () => abortRef.current?.abort();
  }, [id]);

  const handleBooked = (msg: string) => {
    setBanner(msg);
    fetchRestaurant(); // refresh availability
    window.setTimeout(() => setBanner(null), 3000);
  };

  if (loading && !restaurant) return <div>Loading…</div>;
  if (!restaurant) return <div>Restaurant not found.</div>;

  return (
    <div>
      {banner && (
        <div className="alert alert--success" role="status" aria-live="polite">
          {banner}
        </div>
      )}
      <RestaurantDetails
        restaurant={restaurant}
        desiredSeats={tableCount}
        onBooked={handleBooked}
      />
    </div>
  );
}
