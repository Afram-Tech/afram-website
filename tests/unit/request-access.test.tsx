import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

// The modal is a client component; the form sends its mutation through a hook and
// reads the pathname from Next's router. Neither is what's under test here.
vi.mock("next/navigation", () => ({ usePathname: () => "/" }));
vi.mock("@/hooks/data", () => ({
  useRequestAccess: () => ({ requestAccess: vi.fn() }),
}));

import { RequestAccess } from "@/components/access/RequestAccess";

const visit = (url: string) => window.history.replaceState(null, "", url);
const dialog = () => screen.queryByRole("dialog");

/**
 * The hand-off from the app: its gated signup screens link to
 * `…/?request-access=1&userType=issuer`, and the form is expected to be open
 * on arrival rather than leaving someone to find it.
 */
describe("RequestAccess — arriving from the app", () => {
  beforeEach(() => visit("/"));

  it("opens the form, on the role the link names", async () => {
    visit("/?request-access=1&userType=issuer");
    render(<RequestAccess />);

    expect(await screen.findByRole("dialog")).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: "Vendor" })).toBeChecked();
  });

  it("defaults to Member when the link names no role", async () => {
    visit("/?request-access=1");
    render(<RequestAccess />);

    expect(await screen.findByRole("dialog")).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: "Member" })).toBeChecked();
  });

  it("strips its own params and keeps the rest, so a refresh isn't a modal", () => {
    visit("/properties?utm_source=email&request-access=1&userType=financier");
    render(<RequestAccess />);

    expect(window.location.pathname).toBe("/properties");
    expect(window.location.search).toBe("?utm_source=email");
  });

  it("stays shut on a normal visit", () => {
    visit("/?utm_source=email");
    render(<RequestAccess />);

    expect(dialog()).not.toBeInTheDocument();
    expect(window.location.search).toBe("?utm_source=email");
  });
});

describe("RequestAccess — closing", () => {
  beforeEach(() => visit("/?request-access=1"));

  it("closes on Escape", async () => {
    render(<RequestAccess />);
    await screen.findByRole("dialog");

    fireEvent.keyDown(document, { key: "Escape" });

    await waitFor(() => expect(dialog()).not.toBeInTheDocument());
  });

  it("closes from the backdrop but not from inside the panel", async () => {
    render(<RequestAccess />);
    const panel = await screen.findByRole("dialog");

    fireEvent.click(panel);
    expect(dialog()).toBeInTheDocument();

    fireEvent.click(panel.previousElementSibling!);
    await waitFor(() => expect(dialog()).not.toBeInTheDocument());
  });
});
