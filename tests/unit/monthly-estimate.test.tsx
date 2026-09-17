import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { indicativeMonthly } from "@/features/landing/affordability";
import { MonthlyEstimate } from "@/features/landing/MonthlyEstimate";

describe("indicativeMonthly", () => {
  it("quotes the marketplace plan — 20% down, balance over 10 years", () => {
    expect(indicativeMonthly(32_400)).toBe(372);
  });

  it("scales linearly with the price", () => {
    expect(indicativeMonthly(64_800)).toBe(indicativeMonthly(32_400) * 2);
  });
});

describe("MonthlyEstimate", () => {
  it("shows the monthly figure in the listing's currency", () => {
    render(<MonthlyEstimate price={32_400} currency="USD" />);
    expect(screen.getByText("$372")).toBeInTheDocument();
  });

  it("reveals the breakdown when the info trigger is focused", async () => {
    render(<MonthlyEstimate price={32_400} currency="USD" />);
    const trigger = screen.getByRole("button", { name: "How this monthly is worked out" });
    expect(trigger).toHaveAttribute("aria-expanded", "false");

    await userEvent.tab();
    expect(trigger).toHaveFocus();
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText("20% of the price")).toBeInTheDocument();
    expect(screen.getByText("10 years")).toBeInTheDocument();
  });
});
