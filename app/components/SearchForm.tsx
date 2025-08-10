import React from "react";

type Props = {
  location: string;
  tableCount: number;
  onLocationChange: (value: string) => void;
  onTableCountChange: (value: number) => void;
};

const SearchForm: React.FC<Props> = ({
  location,
  tableCount,
  onLocationChange,
  onTableCountChange,
}) => {
  return (
    <div className="search-form">
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
    </div>
  );
};

export default SearchForm;
