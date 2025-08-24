import React, { useState, useEffect } from 'react';

type Props = {
  location: string;
  tableCount: number;                          // parent remains numeric
  onLocationChange: (value: string) => void;
  onTableCountChange: (value: number) => void; // parent stays number
};

const clampMin = (n: number) => (Number.isFinite(n) && n >= 1 ? Math.floor(n) : 1);

const SearchForm: React.FC<Props> = ({
  location,
  tableCount,
  onLocationChange,
  onTableCountChange,
}) => {
  // local string state so user can clear the field without “0” popping in
  const [tableCountStr, setTableCountStr] = useState(String(tableCount));

  // keep local string in sync when parent changes (e.g., from route)
  useEffect(() => {
    setTableCountStr(String(tableCount));
  }, [tableCount]);

  const handleSeatsChange = (raw: string) => {
    // keep only digits
    const digits = raw.replace(/\D+/g, '');
    // allow temporary empty input
    if (digits === '') {
      setTableCountStr('');      // show empty while typing
      return;
    }
    // strip leading zeros & clamp
    const n = clampMin(parseInt(digits, 10));
    setTableCountStr(String(n));
    onTableCountChange(n);       // update parent immediately
  };

  const commitIfEmptyOnBlur = () => {
    if (tableCountStr === '') {
      setTableCountStr('1');
      onTableCountChange(1);
    }
  };

  const step = (delta: 1 | -1) => {
    const n = clampMin((parseInt(tableCountStr || '1', 10) || 1) + delta);
    setTableCountStr(String(n));
    onTableCountChange(n);
  };

  return (
    <div className="search-form">
       <label htmlFor="location" className="sr-only">Location</label>
       <input
         id="location"
         className="search-form__location"
         type="text"
         placeholder="Location"
         value={location}
         onChange={(e) => onLocationChange(e.target.value)}
       />

      <div className="search-form__seats">
          <button
            className="btn btn--square"
            type="button"
            aria-label="Decrease seats"
            onClick={() => step(-1)}
          >
            −
          </button>

        <input
              type="number"
              inputMode="numeric"
              pattern="[0-9]*"
              step={1}
              min={1}
              placeholder="Table Count"
              aria-label="Minimum seats"
              value={tableCountStr}
              onChange={(e) => handleSeatsChange(e.target.value)}
              onBlur={commitIfEmptyOnBlur}
            />

            <button
              className="btn btn--square"
              type="button"
              aria-label="Increase seats"
              onClick={() => step(1)}
            >
              +
            </button>
          </div>
        </div>
  );
};

export default SearchForm;
