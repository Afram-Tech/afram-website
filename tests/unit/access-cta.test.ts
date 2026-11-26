import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

/* INVITE_ONLY is resolved once, at module load, from process.env — so each
   case stubs the variable and re-imports the module. */
const load = async () => {
  vi.resetModules();
  return import("@/features/access/cta");
};

describe("accessCta", () => {
  beforeEach(() => vi.stubEnv("NEXT_PUBLIC_INVITE_ONLY", ""));
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  it("shows Request Access while the site is invite-only, keeping the role in the href", async () => {
    vi.stubEnv("NEXT_PUBLIC_INVITE_ONLY", "true");
    const { accessCta, signUpHref } = await load();

    const cta = accessCta({ label: "Get Started", href: signUpHref("issuer") });

    expect(cta.label).toBe("Request Access");
    // The dialog opens on the role this param names (see RequestAccess).
    expect(cta.href).toContain("userType=issuer");
  });

  it("links to this page's request-access form, not the app's sign-up URL", async () => {
    vi.stubEnv("NEXT_PUBLIC_INVITE_ONLY", "true");
    const { accessCta, signUpHref } = await load();

    // Even when NEXT_PUBLIC_CLIENT_APP is unset and the sign-up URL is junk.
    expect(accessCta({ label: "Get Started", href: signUpHref("financier") }).href).toBe(
      "?request-access=1&userType=financier",
    );
    expect(accessCta({ label: "Get Started", href: "undefined/get-started" }).href).toBe(
      "?request-access=1",
    );
  });

  it("leaves a CTA alone when signup is open", async () => {
    vi.stubEnv("NEXT_PUBLIC_INVITE_ONLY", "false");
    const { accessCta, signUpHref } = await load();

    const cta = accessCta({ label: "List a project", href: signUpHref() });

    expect(cta.label).toBe("List a project");
    expect(cta.href).toContain("/get-started");
  });

  it("stays invite-only when the flag is unset, and for any value that is not an opt-out", async () => {
    for (const value of ["", "yes", "0ff", "TRUE"]) {
      vi.stubEnv("NEXT_PUBLIC_INVITE_ONLY", value);
      const { accessCta } = await load();
      expect(accessCta({ label: "Get Started", href: "/x" }).label).toBe("Request Access");
    }
  });
});
