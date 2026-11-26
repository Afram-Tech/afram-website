import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { LogoTicker } from "@/components/ui/LogoTicker";

const LOGOS = [
  { name: "Ecobank", src: "/partners/ecobank.svg" },
  { name: "Origen", src: "/partners/origen-logo-trimmed.png" },
  { name: "Wordmark Only" },
];

describe("LogoTicker", () => {
  it("names each logo once; the repeats that fill the loop are hidden", () => {
    const { container } = render(<LogoTicker logos={LOGOS} />);
    expect(screen.getAllByRole("img", { name: "Ecobank" })).toHaveLength(1);
    expect(screen.getAllByRole("img", { name: "Origen" })).toHaveLength(1);

    // Six tiles per half at least, doubled for a seamless loop.
    const tiles = container.querySelectorAll("li");
    expect(tiles).toHaveLength(12);
    expect(container.querySelectorAll('li:not([aria-hidden="true"])')).toHaveLength(LOGOS.length);
  });

  it("falls back to a wordmark when a logo has no file", () => {
    render(<LogoTicker logos={LOGOS} />);
    expect(screen.getAllByText("Wordmark Only")[0]).toBeInTheDocument();
  });

  it("renders nothing without logos", () => {
    const { container } = render(<LogoTicker logos={[]} />);
    expect(container).toBeEmptyDOMElement();
  });
});
