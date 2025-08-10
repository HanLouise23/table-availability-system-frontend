import React from 'react';
import Header from '../components/Header';
import type { Restaurant } from '../models/Restaurant';

type Props = {
  restaurant: Restaurant;
};

const RestaurantDetails: React.FC<Props> = ({ restaurant }) => {
  return (
    <div>
      <Header />
      <h1>{restaurant.name}</h1>
      <img src={restaurant.mainImageUrl} alt={restaurant.name} style={{ width: '300px' }} />
      <p>
        {restaurant.address.line_1}, {restaurant.address.city}, {restaurant.address.postcode}
      </p>
      <p>Phone: {restaurant.contact.phone}</p>
      <p>Email: {restaurant.contact.email}</p>
      <h2>Tables</h2>
      <ul>
        {restaurant.tables.map((table) => (
          <li key={table.table_id}>
            Seats: {table.seats} —{' '}
            {table.booked_by ? `Booked by ${table.booked_by}` : 'Available'}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RestaurantDetails;
