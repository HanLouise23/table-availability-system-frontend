import React from 'react';
import type { Restaurant } from "~/types";

type Props = { restaurant: Restaurant };

const RestaurantDetails: React.FC<Props> = ({ restaurant }) => {
  return (
    <div className="restaurant-details">
      <h1>{restaurant.name}</h1>
      <img src={restaurant.mainImageUrl} alt={restaurant.name}/>
      <p>{restaurant.address.line_1}, {restaurant.address.city}, {restaurant.address.postcode}</p>
      <p>Phone: {restaurant.contact.phone}</p>
      <p>Email: {restaurant.contact.email}</p>

      <h2>Tables</h2>
      <ul>
        {restaurant.tables.map((t) => (
          <li key={t.table_id}>
            Seats: {t.seats} — {t.booked_by ? `Booked by ${t.booked_by}` : 'Available'}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RestaurantDetails;
