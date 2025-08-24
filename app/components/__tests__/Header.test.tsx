import React from "react";
import { render, screen } from "@testing-library/react";
import Header from "~/components/Header";

describe("Header", () => {
  it("renders the banner shell and text", () => {
    render(<Header />);
    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(screen.getByText(/table availability system/i)).toBeInTheDocument();
  });

  it("renders two decorative images with correct classes & attrs", () => {
    render(<Header />);
    const banner = screen.getByRole("banner");

    // Query the DOM directly because decorative images are removed from the a11y tree
    const imgs = banner.querySelectorAll("img.banner-img");
    expect(imgs).toHaveLength(2);

    imgs.forEach((img) => {
      expect(img).toHaveAttribute("alt", "");
      expect(img).toHaveAttribute("aria-hidden", "true");
      expect(img).toHaveClass("banner-img");
    });
  });

  it("sets image src via mocked file loader", () => {
    render(<Header />);
    const banner = screen.getByRole("banner");
    const imgs = banner.querySelectorAll("img.banner-img");

    // fileMock.ts exports "test-file-stub.png"
    imgs.forEach((img) => {
      expect(img).toHaveAttribute("src", "test-file-stub.png");
    });
  });
});
