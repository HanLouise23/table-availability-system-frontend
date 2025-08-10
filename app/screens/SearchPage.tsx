import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import SearchForm from '../components/SearchForm';
import RestaurantCard from '../components/RestaurantCard';
import type { Restaurant } from '../models/Restaurant';

const SearchPage: React.FC = () => {
  const [location, setLocation] = useState('');
  const [tableCount, setTableCount] = useState(2);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!location.trim()) {
      setRestaurants([]);
      return;
    }

    const queryParams = new URLSearchParams({
      location: location,
      has_tables: 'true',
      min_seats: tableCount.toString(),
    });

    setLoading(true);

    fetch(`http://localhost:8000/restaurants?${queryParams}`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setRestaurants(data);
      })
      .catch((err) => {
        console.error('Fetch error:', err);
        setRestaurants([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [location, tableCount]);

  return (
    <div style={{ padding: '1rem' }}>
      <Header />
      <SearchForm
        location={location}
        tableCount={tableCount}
        onLocationChange={setLocation}
        onTableCountChange={setTableCount}
      />

      <div style={{ marginTop: '1rem' }}>
        {loading && <p>Loading...</p>}
        {!loading && restaurants.length === 0 && location && (
          <p>No matching restaurants found.</p>
        )}
        {!loading &&
          restaurants.map((r) => (
            <RestaurantCard key={r.id} restaurant={r} />
          ))}
      </div>
    </div>
  );
};

export default SearchPage;
