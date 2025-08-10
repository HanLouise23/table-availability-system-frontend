import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import RestaurantDetails from "../screens/RestaurantDetails";

export default function RestaurantDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [restaurant, setRestaurant] = useState(null);

  useEffect(() => {
    if (id) {
      fetch(`http://localhost:8000/restaurants/${id}`)
        .then((res) => res.json())
        .then((data) => setRestaurant(data))
        .catch((err) => console.error("Error fetching restaurant:", err));
    }
  }, [id]);

  if (!restaurant) {
    return <div>Loading...</div>;
  }

  return <RestaurantDetails restaurant={restaurant} />;
}