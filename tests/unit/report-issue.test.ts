import { describe, expect, it } from "vitest";

import { parseIssueReport } from "@/features/help/report-issue";

const form = (fields: Record<string, string>) => {
  const data = new FormData();
  for (const [name, value] of Object.entries(fields)) data.set(name, value);
  return data;
};

const VALID = {
  kind: "bug",
  area: "access",
  impact: "blocked",
  title: "  Access link expired  ",
  details: "I opened the link from my email and it said expired.",
  email: "",
  path: "/help",
  userAgent: "Test",
  viewport: "390×844",
  language: "en-GH",
};

describe("parseIssueReport", () => {
  it("builds the Exchange's report body, trimmed, with the visitor's context", () => {
    const result = parseIssueReport(form(VALID), new Date("2026-10-19T09:00:00.000Z"));

    expect(result).toEqual({
      ok: true,
      payload: {
        kind: "bug",
        area: "access",
        impact: "blocked",
        title: "Access link expired",
        details: "I opened the link from my email and it said expired.",
        screenshots: [],
        context: {
          page: "Website · Help",
          role: "Website visitor",
          reporter: "Not given",
          path: "/help",
          userAgent: "Test",
          viewport: "390×844",
          language: "en-GH",
          build: "afram-website",
          reportedAt: "2026-10-19T09:00:00.000Z",
        },
      },
    });
  });

  it("uses the email as the reporter when one is given", () => {
    const result = parseIssueReport(form({ ...VALID, email: " ama@email.com " }));
    expect(result.ok && result.payload.context.reporter).toBe("ama@email.com");
  });

  it.each([
    ["area", { area: "" }, "Choose what it's about."],
    ["impact", { impact: "urgent" }, "Choose how much it's affecting you."],
    ["title", { title: "Hi" }, "Add a short summary (5+ characters)."],
    ["details", { details: "Broken" }, "Tell us a little more (10+ characters)."],
    ["email", { email: "not-an-email" }, "Enter a valid email, or leave it blank."],
  ])("points at the %s field when it's wrong", (field, change, message) => {
    expect(parseIssueReport(form({ ...VALID, ...change }))).toEqual({
      ok: false,
      state: { status: "error", message, field },
    });
  });
});
