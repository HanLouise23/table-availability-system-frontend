import React, { useMemo, useState, useRef } from "react";
import type { Restaurant } from "~/types";
import RatingStars from "./RatingStars";
import { bookTable } from "../services/restaurants";

type Props = {
  restaurant: Restaurant;
  desiredSeats?: number;                // from route (tableCount)
  onBooked?: (msg: string) => void;     // route shows success banner + refetch
};

const RestaurantDetails: React.FC<Props> = ({ restaurant, desiredSeats, onBooked }) => {
  // ----- Carousel state -----
  const [heroIndex, setHeroIndex] = useState(0);

  const controllerRef = useRef<AbortController | null>(null);
  const toDigits = (s: string) => s.replace(/\D+/g, "");
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const images: string[] = useMemo(() => {
    const rest = (restaurant.imageUrls ?? []).filter(Boolean);
    return [restaurant.mainImageUrl, ...rest].filter(Boolean);
  }, [restaurant.mainImageUrl, restaurant.imageUrls]);

  const prev = () => setHeroIndex((i) => (i - 1 + images.length) % images.length);
  const next = () => setHeroIndex((i) => (i + 1) % images.length);
  const setHero = (idx: number) => setHeroIndex(idx);

  // ----- Availability summary -----
  const availableTables = restaurant.tables.filter(t => !t.booked_by);
  const tablesAvailable = availableTables.length;
  const seatsAvailable = availableTables.reduce((acc, t) => acc + t.seats, 0);

  // ----- Booking form state -----
  const [showForm, setShowForm] = useState(false);
  const [selectedTableId, setSelectedTableId] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  // Recommend a table (smallest that meets/exceeds desired seats)
  const recommendedTable = useMemo(() => {
    if (!desiredSeats) return null;
    const sorted = [...availableTables].sort((a, b) => a.seats - b.seats);
    return sorted.find(t => t.seats >= desiredSeats) ?? sorted[0] ?? null;
  }, [availableTables, desiredSeats]);

  const openForm = () => {
    setShowForm(true);
    if (recommendedTable) setSelectedTableId(recommendedTable.table_id);
  };
  const tableSelectRef = React.useRef<HTMLSelectElement | null>(null);
  React.useEffect(() => {
      if (showForm) tableSelectRef.current?.focus();
  }, [showForm]);

  // ----- Booking submission -----
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    if (!selectedTableId) {
      setFormError("Please select a table.");
      return;
    }
    const trimmedName = name.trim();
    if (!trimmedName) {
      setFormError("Please enter your name.");
      return;
    }
    const digits = toDigits(phone);
    if (digits.length !== 11) {
      setPhoneError("Please enter an 11-digit UK mobile number, for example 07123 456 789.");
      return;
    }
    try {
      setSubmitting(true);
      controllerRef.current?.abort();
      const c = new AbortController();
      controllerRef.current = c;

      await bookTable(
        restaurant.id,
        selectedTableId,
        { name: trimmedName, phone_number: digits },
        c.signal
      );

      onBooked?.(`Table ${selectedTableId} booked successfully.`);
      setShowForm(false);
      setName("");
      setPhone("");
      setSelectedTableId(null);
    } catch (err) {
      setFormError("Booking failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

return (
  <div className="restaurant-details">
    {/* Title + rating */}
    <div className="card">
      <div className="card__header">
        <h1 className="restaurant-details__title card__title">{restaurant.name.trim()}</h1>
        <RatingStars rating={restaurant.rating} />
      </div>

        {/* Hero image */}
        {images.length > 0 && (
          <img
            src={images[heroIndex]}
            alt={`${restaurant.name.trim()} photo ${heroIndex + 1}`}
            className="restaurant-details__hero-img"
          />
        )}

        {/* Carousel */}
        {images.length > 1 && (
          <div className="carousel" aria-label="Restaurant gallery">
            <button
              className="carousel__btn"
              type="button"
              onClick={prev}
              aria-label="Previous slide"
            >
              ‹
            </button>

            <div className="carousel__thumbs">
              {images.map((src, idx) => (
                <button
                  key={src + idx}
                  className={`carousel__thumb ${idx === heroIndex ? "is-active" : ""}`}
                  onClick={() => setHero(idx)}
                  aria-label={`Show slide ${idx + 1}`}
                >
                  <img className="carousel__thumb-img" src={src} alt="" aria-hidden />
                </button>
              ))}
            </div>

            <button
              className="carousel__btn"
              type="button"
              onClick={next}
              aria-label="Next slide"
            >
              ›
            </button>
          </div>
        )}
      </div>

      {/* Info card */}
      <div className="card">
        <div className="card__header">
          <h2 className="card__title">Restaurant information</h2>
        </div>
        <ul className="info-list">
          <li className="info-list__item">
            <span className="info-list__icon" aria-hidden={true}>📍</span>
            <span>{restaurant.address.line_1}, {restaurant.address.city}, {restaurant.address.postcode}</span>
          </li>
          <li className="info-list__item">
            <span className="info-list__icon" aria-hidden={true}>📍</span>
            <span>{restaurant.contact.phone}</span>
          </li>
          <li className="info-list__item">
            <span className="info-list__icon" aria-hidden={true}>📍</span>
            <span>{restaurant.contact.email}</span>
          </li>
        </ul>

        <p className="restaurant-details__availability" style={{ marginTop: "0.75rem" }}>
          <strong>{tablesAvailable}</strong> table{tablesAvailable !== 1 ? "s" : ""} available,&nbsp;
          <strong>{seatsAvailable}</strong> seat{seatsAvailable !== 1 ? "s" : ""} total.
        </p>

        {!showForm && (
          <button className="btn btn--primary" onClick={openForm}>
            Book a table
          </button>
        )}
      </div>

      {/* Booking form */}
      {showForm && (
        <div className="card">
          <div className="card__header">
            <h3 className="card__title">Book a table</h3>
          </div>

          {desiredSeats && recommendedTable && (
            <p className="restaurant-details__availability">
              Based on your search we recommend <strong>table {recommendedTable.table_id}</strong>
              {` (seats ${recommendedTable.seats})`}.
            </p>
          )}

          <form className="booking-form" onSubmit={handleSubmit}>
            <div className="booking-form__field">
              <label htmlFor="table">Table</label>
              <select
                id="table"
                ref={tableSelectRef}
                value={selectedTableId ?? ""}
                onChange={(e) => setSelectedTableId(Number(e.target.value))}
                required
              >
                <option value="" disabled>Select a table</option>
                {availableTables.map((t) => (
                  <option key={t.table_id} value={t.table_id}>
                    Table {t.table_id} — {t.seats} seats
                  </option>
                ))}
              </select>
            </div>

            <div className="booking-form__field">
              <label htmlFor="name">Your name</label>
              <input
                id="name"
                value={name}
                maxLength={200}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="booking-form__field">
              <label htmlFor="phone">Phone number</label>
               <p id="phone-hint" className="form-hint">
                 Enter 11 digits, for example 07123 456 789.
               </p>
               <input
                 id="phone"
                 type="tel"
                 inputMode="tel"
                 aria-describedby="phone-hint"
                 aria-invalid={!!phoneError}
                 value={phone}
                 onChange={(e) => {
                   const digits = toDigits(e.target.value).slice(0, 11);
                   setPhone(digits);
                   setPhoneError(digits.length > 0 && digits.length < 11
                     ? "Please enter an 11-digit UK mobile number, for example 07123 456 789."
                     : null
                   );
                 }}
                 required
               />
               {phoneError && <p className="form-error" role="alert">{phoneError}</p>}
               {formError && <p className="form-error" role="alert">{formError}</p>}
            </div>

            <div className="booking-form__actions">
              <button
                type="button"
                className="btn"
                onClick={() => setShowForm(false)}
                disabled={submitting}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn--primary" disabled={submitting}>
                {submitting ? "Booking…" : "Book"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default RestaurantDetails;
