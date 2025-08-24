import React from "react";
import { render, screen } from "@testing-library/react";
import Header from "~/components/Header";

describe("Header", () => {
  it("renders the banner shell and text", () => {
    const { container } = render(<Header />);
    // header element with expected class
    const header = container.querySelector("header.header-banner");
    expect(header).toBeInTheDocument();

    // main banner text
    expect(
      screen.getByText("Table Availability System")
    ).toBeInTheDocument();
  });

  it("renders the left and right images with correct alt text and class", () => {
    render(<Header />);

    const left = screen.getByRole("img", { name: /left decoration/i });
    const right = screen.getByRole("img", { name: /right decoration/i });

    expect(left).toBeInTheDocument();
    expect(right).toBeInTheDocument();

    // classes applied
    expect(left).toHaveClass("banner-img");
    expect(right).toHaveClass("banner-img");
  });

  it("sets image src via mocked file loader", () => {
    render(<Header />);
    const images = screen.getAllByRole("img");
    // fileMock.ts exports "test-file-stub.png"
    for (const img of images) {
      expect(img).toHaveAttribute("src", "test-file-stub.png");
    }
  });
});
