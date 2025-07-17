// app/components/RestaurantCard.tsx
import React from 'react';

type Restaurant = {
  id: number;
  name: string;
  address: {
    line_1: string;
    city: string;
    postcode: string;
  };
  contact: {
    phone: string;
    email: string;
  };
  tables: {
    table_id: number;
    seats: number;
    booked_by: string | null;
    phone_number: string | null;
  }[];
};


const RestaurantCard: React.FC<{ restaurant: Restaurant }> = ({ restaurant }) => {
  return (
    <div style={{
      border: '1px solid #ccc',
      borderRadius: '4px',
      margin: '0.5rem auto',
      padding: '1rem',
      maxWidth: '600px',
      textAlign: 'left'
    }}>
      <h2>{restaurant.name.trim()}</h2>
      <p>
        {restaurant.address.line_1}, {restaurant.address.city}, {restaurant.address.postcode}
      </p>
      <p>
        Contact: {restaurant.contact.phone.trim()} | {restaurant.contact.email}
      </p>
      <p>
        Tables available: {restaurant.tables.length}
      </p>
    </div>
  );
};


export default RestaurantCard;
