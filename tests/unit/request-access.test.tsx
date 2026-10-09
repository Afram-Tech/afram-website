import { render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// The dialog is a client component; the form posts to a server action and
// reads the pathname from Next's router. Neither is what's under test here.
vi.mock("next/navigation", () => ({ usePathname: () => "/" }));
vi.mock("@/features/access/actions", () => ({
  requestAccess: vi.fn(async () => ({ status: "idle" })),
}));

import { RequestAccess } from "@/components/access/RequestAccess";

const visit = (url: string) => window.history.replaceState(null, "", url);
const dialog = () => document.querySelector("dialog")!;

/**
 * The hand-off from the app: its gated signup screens link to
 * `…/?request-access=1&userType=issuer`, and the form is expected to be open
 * on arrival rather than leaving someone to find it.
 */
describe("RequestAccess — arriving from the app", () => {
  /* This jsdom carries a non-functional showModal stub, so the setup file's
     polyfill never installs and the real call leaves the dialog shut. Stand in
     for it here and the open state becomes observable. */
  beforeEach(() => {
    visit("/");
    vi.spyOn(HTMLDialogElement.prototype, "showModal").mockImplementation(function (
      this: HTMLDialogElement,
    ) {
      this.setAttribute("open", "");
    });
  });

  afterEach(() => vi.restoreAllMocks());

  it("opens the form, on the role the link names", () => {
    visit("/?request-access=1&userType=issuer");
    render(<RequestAccess />);

    expect(dialog()).toHaveAttribute("open");
    expect(screen.getByRole("radio", { name: "Vendor" })).toBeChecked();
  });

  it("defaults to Member when the link names no role", () => {
    visit("/?request-access=1");
    render(<RequestAccess />);

    expect(dialog()).toHaveAttribute("open");
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

    expect(dialog()).not.toHaveAttribute("open");
    expect(window.location.search).toBe("?utm_source=email");
  });
});
