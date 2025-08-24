import React, { useState } from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SearchForm from "~/components/SearchForm";

// Render through a tiny parent so props update when handlers fire
const renderWithState = (
  initial: { location?: string; tableCount?: number } = {}
) => {
  const events = {
    onLocationChange: jest.fn(),
    onTableCountChange: jest.fn(),
  };

  const Wrapper = () => {
    const [location, setLocation] = useState(initial.location ?? "");
    const [tableCount, setTableCount] = useState(initial.tableCount ?? 2);
    return (
      <SearchForm
        location={location}
        tableCount={tableCount}
        onLocationChange={(v) => {
          events.onLocationChange(v);
          setLocation(v);
        }}
        onTableCountChange={(n) => {
          events.onTableCountChange(n);
          setTableCount(n);
        }}
      />
    );
  };

  render(<Wrapper />);
  return {
    ...events,
    locationInput: screen.getByLabelText(/location/i),
    seatsInput: screen.getByLabelText(/minimum seats/i),
    decBtn: screen.getByRole("button", { name: /decrease seats/i }),
    incBtn: screen.getByRole("button", { name: /increase seats/i }),
  };
};

describe("SearchForm", () => {
  it("renders with initial values and updates location as user types", async () => {
    const user = userEvent.setup();
    const { locationInput, seatsInput, onLocationChange } = renderWithState({
      location: "",
      tableCount: 3,
    });

    expect(locationInput).toHaveValue("");
    expect(seatsInput).toHaveValue(3);

    await user.type(locationInput, "London");

    // Final rendered value should reflect the whole string
    expect(locationInput).toHaveValue("London");
    // Handler should have been called with the whole string at least once
    expect(onLocationChange).toHaveBeenCalledWith("London");
  });

  it("increments and decrements seats via buttons, clamping at 1", async () => {
    const user = userEvent.setup();
    const { seatsInput, incBtn, decBtn, onTableCountChange } = renderWithState({
      tableCount: 2,
    });

    await user.click(incBtn);
    expect(seatsInput).toHaveValue(3);
    expect(onTableCountChange).toHaveBeenLastCalledWith(3);

    await user.click(decBtn);
    expect(seatsInput).toHaveValue(2);
    expect(onTableCountChange).toHaveBeenLastCalledWith(2);

    await user.click(decBtn);
    expect(seatsInput).toHaveValue(1);
    expect(onTableCountChange).toHaveBeenLastCalledWith(1);

    await user.click(decBtn); // clamp at 1
    expect(seatsInput).toHaveValue(1);
    expect(onTableCountChange).toHaveBeenLastCalledWith(1);
  });

  it("accepts leading zeros and normalises to a number, updating parent immediately", async () => {
    const { seatsInput, onTableCountChange } = renderWithState({ tableCount: 2 });

    // Use a single change with the full string; normalises '0005' -> 5
    fireEvent.change(seatsInput, { target: { value: "0005" } });
    await waitFor(() => expect(seatsInput).toHaveValue(5));
    expect(onTableCountChange).toHaveBeenLastCalledWith(5);
  });

  it("does not notify parent while temporarily empty; commits 1 on blur", async () => {
    const user = userEvent.setup();
    const { seatsInput, onTableCountChange } = renderWithState({ tableCount: 2 });
    onTableCountChange.mockClear();

    await user.clear(seatsInput);
    // empty number input => valueAsNumber is null
    expect(seatsInput).toHaveValue(null);
    expect(onTableCountChange).not.toHaveBeenCalled();

    fireEvent.blur(seatsInput);
    await waitFor(() => expect(seatsInput).toHaveValue(1));
    expect(onTableCountChange).toHaveBeenCalledWith(1);
  });
});
