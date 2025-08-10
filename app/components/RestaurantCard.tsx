import React from "react";
import { Link } from "react-router-dom";
import type { Restaurant } from "../models/Restaurant";

export default function RestaurantCard({ restaurant }: { restaurant: Restaurant }) {
  return (
    <div style={{ border: "1px solid #ccc", borderRadius: 4, margin: "0.5rem auto", padding: "1rem", maxWidth: 600, textAlign: "left" }}>
      <Link to={`/restaurants/${restaurant.id}`}>
        <img
          src={restaurant.mainImageUrl}
          alt={restaurant.name.trim()}
          style={{ width: 150, height: 100, objectFit: "cover", borderRadius: 4 }}
        />
      </Link>
      <div style={{ flex: 1 }}>
        <h2>
          <Link to={`/restaurants/${restaurant.id}`}>{restaurant.name.trim()}</Link>
        </h2>
        <p>{restaurant.address.line_1}, {restaurant.address.city}, {restaurant.address.postcode}</p>
        <p>Contact: {restaurant.contact.phone.trim()} | {restaurant.contact.email}</p>
        <p>Tables available: {restaurant.tables.length}</p>
        <p>Rating: ⭐ {restaurant.rating.toFixed(1)}</p>
      </div>
    </div>
  );
}
