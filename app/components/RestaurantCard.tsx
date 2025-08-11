import React from "react";
import { Link } from "react-router-dom";
import type { Restaurant } from "../models/Restaurant";

const FALLBACK_IMG =
  "https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg?auto=compress&cs=tinysrgb&w=1200";

export default function RestaurantCard({ restaurant }: { restaurant: Restaurant }) {
  const imgSrc = restaurant.mainImageUrl?.trim() || FALLBACK_IMG;
  const name = restaurant.name.trim();
  const phone = restaurant.contact.phone?.trim() ?? "";
  const tablesAvailable = restaurant.tables.length;

  return (
    <article className="restaurant-card">
      <Link to={`/restaurants/${restaurant.id}`} aria-label={`View details for ${name}`}>
        <img
          className="restaurant-card__image"
          src={imgSrc}
          alt={`${name} main`}
          loading="lazy"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = FALLBACK_IMG;
          }}
        />
      </Link>

      <div className="restaurant-card__content">
        <h2 className="restaurant-card__title">
          <Link to={`/restaurants/${restaurant.id}`}>{name}</Link>
        </h2>

        <p className="restaurant-card__address">
          {restaurant.address.line_1}, {restaurant.address.city}, {restaurant.address.postcode}
        </p>

        <div className="restaurant-card__row">
          <p className="restaurant-card__meta">
            <span className="restaurant-card__rating">
              {Array.from({ length: Math.round(restaurant.rating) }, (_, i) => (
                <span key={i}>⭐</span>
              ))}
              <span className="restaurant-card__rating-value">
                {restaurant.rating.toFixed(1)}
              </span>
            </span>
          </p>
          <p className="restaurant-card__meta">Tables: {tablesAvailable}</p>
        </div>

        <p className="restaurant-card__contact">
          Contact: {phone} {phone && " | "} {restaurant.contact.email}
        </p>
      </div>
    </article>
  );
}
