import React from "react";
import { render, screen } from "@testing-library/react";
import RatingStars from "~/components/RatingStars";

it("announces a friendly rating label", () => {
  render(<RatingStars rating={3.0} />);
  expect(
    screen.getByRole("img", { name: /rating of 3\.0 out of 5/i })
  ).toBeInTheDocument();
});
