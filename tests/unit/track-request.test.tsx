import { fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// The lookup goes through a hook; what it returns is set per case.
const getSupportRequestStatus = vi.fn();
vi.mock("@/hooks/data", () => ({
  useSupportRequestStatus: () => ({ getSupportRequestStatus }),
}));

/* siteConfig reads NEXT_PUBLIC_CLIENT_APP once, at module load, so each case
   stubs it and re-imports the tracker. */
const APP = "https://app.example.test";
const load = async () => {
  vi.resetModules();
  return (await import("@/components/help/TrackRequest")).TrackRequest;
};

const helpLinks = () => screen.getAllByRole("link", { name: "Open Help in the app" });

/**
 * The public tracker matches a reference plus the reply email from the public
 * form. Requests raised while signed in to the app have no reply email, so the
 * page has to say where those are tracked instead (GH-70).
 */
describe("TrackRequest, requests raised in the app", () => {
  beforeEach(() => {
    vi.stubEnv("NEXT_PUBLIC_CLIENT_APP", APP);
    getSupportRequestStatus.mockReset();
  });
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  it("says up front that app requests are tracked in the app's Help, and links there", async () => {
    const TrackRequest = await load();
    render(<TrackRequest initial="" />);

    expect(
      screen.getByText(/Raised it while signed in to the Afram app\? Those requests are tracked/),
    ).toBeInTheDocument();
    expect(helpLinks()).toHaveLength(1);
    expect(helpLinks()[0]).toHaveAttribute("href", `${APP}/dashboard/help`);
  });

  it("repeats it in the not-found result, with the same link", async () => {
    getSupportRequestStatus.mockResolvedValue({ data: { getSupportRequestStatus: null } });
    const TrackRequest = await load();
    render(<TrackRequest initial="AF-ABC234" initialEmail="ama@email.com" />);

    fireEvent.click(screen.getByRole("button", { name: "Check" }));

    const notFound = (await screen.findByText(/We couldn.t find/)).parentElement!;
    expect(within(notFound).getByText(/AF-ABC234/)).toBeInTheDocument();
    expect(
      within(notFound).getByText(/If you raised it while signed in to the Afram app/),
    ).toBeInTheDocument();
    expect(within(notFound).getByRole("link", { name: "Open Help in the app" })).toHaveAttribute(
      "href",
      `${APP}/dashboard/help`,
    );
    expect(getSupportRequestStatus).toHaveBeenCalledWith({
      variables: { reference: "AF-ABC234", replyEmail: "ama@email.com" },
    });
  });

  it("keeps the note out of an error result, which is not about where to look", async () => {
    getSupportRequestStatus.mockResolvedValue({ error: new Error("down") });
    const TrackRequest = await load();
    render(<TrackRequest initial="AF-ABC234" initialEmail="ama@email.com" />);

    fireEvent.click(screen.getByRole("button", { name: "Check" }));

    await screen.findByText(/We couldn.t check just now/);
    expect(helpLinks()).toHaveLength(1);
  });
});
