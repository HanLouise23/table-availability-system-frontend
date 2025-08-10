import React, { useEffect, useState } from "react";
import { useParams, useOutletContext } from "react-router-dom";
import type { Restaurant, SearchContext } from "~/types";
import RestaurantDetails from "../components/RestaurantDetails";

export default function RestaurantDetailsPage() {
  const { id } = useParams();
  const { location, tableCount } = useOutletContext<SearchContext>();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);

  useEffect(() => {
    if (!id) return;
    fetch(`http://localhost:8000/restaurants/${id}`)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then(setRestaurant)
      .catch(() => setRestaurant(null));
  }, [id]);

  if (!restaurant) return <div>Loading...</div>;
  return <RestaurantDetails restaurant={restaurant} />;
}
