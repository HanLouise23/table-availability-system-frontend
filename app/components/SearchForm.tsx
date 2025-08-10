import React from "react";

type Props = {
  location: string;
  tableCount: number;
  onLocationChange: (value: string) => void;
  onTableCountChange: (value: number) => void;
  onSearch?: () => void;
};

const SearchForm: React.FC<Props> = ({
  location,
  tableCount,
  onLocationChange,
  onTableCountChange,
  onSearch,
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.();
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{ display: "flex", gap: "0.5rem", justifyContent: "center" }}
      role="search"
    >
      <input
        type="text"
        placeholder="Location"
        value={location}
        onChange={(e) => onLocationChange(e.target.value)}
        aria-label="Location"
      />
      <input
        type="number"
        placeholder="Table Count"
        value={tableCount}
        onChange={(e) => onTableCountChange(Number(e.target.value))}
        min={1}
        aria-label="Minimum seats"
      />
      <button type="submit">Search</button>
    </form>
  );
};

export default SearchForm;
