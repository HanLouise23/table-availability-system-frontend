import React from "react";
import type { JSX } from "react";

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
    stars.push(
      <span key={`f${i}`} className="star star--full" aria-hidden={true}>
        ★
      </span>
    );
  }
  if (hasHalf && stars.length < total) {
    stars.push(
      <span key="h" className="star star--half" aria-hidden={true}>
        ★
      </span>
    );
  }
  while (stars.length < total) {
    stars.push(
      <span
        key={`e${stars.length}`}
        className="star star--empty"
        aria-hidden={true}
      >
        ★
      </span>
    );
  }

  const label = ariaLabel ?? `Rating of ${rating.toFixed(1)} out of 5`;
  const classes = ["stars", className].filter(Boolean).join(" ");

  return (
    <span className={classes} role="img" aria-label={label}>
      {stars}
      <span className="stars__value" aria-hidden={true}>
        {rating.toFixed(1)}
      </span>
    </span>
  );
};

export default RatingStars;
