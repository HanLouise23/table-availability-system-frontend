import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  MemoryRouter,
  Routes,
  Route,
} from "react-router-dom";
import MainLayout from "~/layouts/MainLayout";

// Mock useNavigate but keep the rest of react-router-dom real
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => {
  const actual = jest.requireActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const renderAt = (initialPath = "/") => {
  mockNavigate.mockClear();
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<div data-testid="home">Home</div>} />
          <Route path="restaurants/:id" element={<div data-testid="details">Details</div>} />
        </Route>
      </Routes>
    </MemoryRouter>
  );
};

describe("MainLayout", () => {
  it("renders header, search form, skip link, and a focusable main", () => {
    renderAt("/");

    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(screen.getByText(/table availability system/i)).toBeInTheDocument();

    const skip = screen.getByRole("link", { name: /skip to main content/i });
    expect(skip).toHaveAttribute("href", "#main-content");

    const main = screen.getByRole("main");
    // main element is represented by <main id="main-content" tabIndex={-1}>
    expect(main).toHaveAttribute("id", "main-content");
  });

  it("activating the skip link updates the hash to #main-content", async () => {
    const user = userEvent.setup();
    renderAt("/");

    expect(window.location.hash).toBe(""); // starts empty
    await user.click(screen.getByRole("link", { name: /skip to main content/i }));
    expect(window.location.hash).toBe("#main-content");
  });

  it("navigates to '/' when location input becomes meaningful (>=2 chars) on a non-home route", async () => {
    const user = userEvent.setup();
    renderAt("/restaurants/7");

    const locationInput = screen.getByLabelText(/location/i);

    // Type 1 char => no navigate
    await user.type(locationInput, "L");
    expect(mockNavigate).not.toHaveBeenCalled();

    // Type second char => triggers navigate("/")
    await user.type(locationInput, "o");
    expect(mockNavigate).toHaveBeenCalledWith("/");
  });

  it("navigates to '/' when tableCount changes AND location already has >=2 chars on a non-home route", async () => {
    const user = userEvent.setup();
    renderAt("/restaurants/5");

    // First, make location meaningful (this will trigger an initial navigate)
    await user.type(screen.getByLabelText(/location/i), "Leeds");
    expect(mockNavigate).toHaveBeenCalledWith("/");

    // Clear calls to isolate the next behavior
    mockNavigate.mockClear();

    // Change table count via the + button -> should navigate again
    await user.click(screen.getByRole("button", { name: /increase seats/i }));
    expect(mockNavigate).toHaveBeenCalledWith("/");
  });

  it("does NOT navigate when on home route, even if location is meaningful", async () => {
    const user = userEvent.setup();
    renderAt("/");

    await user.type(screen.getByLabelText(/location/i), "Lo");
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
