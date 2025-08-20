import React from "react";
import type { Restaurant } from "~/types";
import { Link } from "react-router-dom";
import RatingStars from "./RatingStars";

type Props = { restaurant: Restaurant };

const RestaurantCard: React.FC<Props> = ({ restaurant }) => {
  const tablesAvailable = restaurant.tables.filter(t => !t.booked_by).length;

  const detailsUrl = `/restaurants/${restaurant.id}`;

  return (
    <div className="restaurant-card">
      {/* Image links to details */}
      <Link to={detailsUrl}>
        <img
          className="restaurant-card__image"
          src={restaurant.mainImageUrl}
          alt={restaurant.name}
        />
      </Link>

      {/* Content column */}
      <div className="restaurant-card__content">
        <h2 className="restaurant-card__title">
          <Link to={detailsUrl}>{restaurant.name}</Link>
        </h2>

        <p className="restaurant-card__address">
          {restaurant.address.line_1}, {restaurant.address.city},{" "}
          {restaurant.address.postcode}
        </p>

        <div className="restaurant-card__row">
          <p className="restaurant-card__meta">
            <RatingStars rating={restaurant.rating} />
          </p>
          <p className="restaurant-card__meta">Tables: {tablesAvailable}</p>
        </div>
      </div>
    </div>
  );
};

export default RestaurantCard;
