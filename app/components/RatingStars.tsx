import React from "react";

type Props = {
  rating: number;
  className?: string;
  ariaLabel?: string;
};

const RatingStars: React.FC<Props> = ({ rating, className, ariaLabel }) => {
  const full = Math.floor(rating);
  const decimal = rating - full;
  const hasHalf = decimal >= 0.25 && decimal < 0.75;
  const total = 5;

  const stars: JSX.Element[] = [];
  for (let i = 0; i < full && i < total; i++) {
    stars.push(<span key={`f${i}`} className="star star--full">★</span>);
  }
  if (hasHalf && stars.length < total) {
    stars.push(<span key="h" className="star star--half">★</span>);
  }
  while (stars.length < total) {
    stars.push(<span key={`e${stars.length}`} className="star star--empty">★</span>);
  }

  return (
    <span
      className={`stars ${className ?? ""}`}
      aria-label={ariaLabel ?? `Rating ${rating.toFixed(1)} out of 5`}
    >
      {stars}
      <span className="stars__value">{rating.toFixed(1)}</span>
    </span>
  );
};

export default RatingStars;
