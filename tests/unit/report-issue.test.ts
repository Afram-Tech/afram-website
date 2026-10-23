import { describe, expect, it } from "vitest";

import {
  guessKind,
  parseIssueReport,
  parseReference,
  titleFrom,
} from "@/features/help/report-issue";

const form = (fields: Record<string, string>) => {
  const data = new FormData();
  for (const [name, value] of Object.entries(fields)) data.set(name, value);
  return data;
};

const VALID = {
  message: "  My access link says it has expired. I opened it straight from the email.  ",
  email: "",
  path: "/help",
  userAgent: "Test",
  viewport: "390×844",
  language: "en-GH",
};

describe("parseIssueReport", () => {
  it("builds the Exchange's report body from one message, with the visitor's context", () => {
    const result = parseIssueReport(form(VALID), new Date("2026-10-19T09:00:00.000Z"));

    expect(result).toEqual({
      ok: true,
      payload: {
        kind: "bug",
        area: "other",
        impact: "workaround",
        title: "My access link says it has expired",
        details: "My access link says it has expired. I opened it straight from the email.",
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
    ["message", { message: "Broken" }, "Tell us a little more, so we can find the problem."],
    ["email", { email: "not-an-email" }, "Enter a valid email, or leave it blank."],
  ])("points at the %s field when it's wrong", (field, change, message) => {
    expect(parseIssueReport(form({ ...VALID, ...change }))).toEqual({
      ok: false,
      state: { status: "error", message, field },
    });
  });
});

describe("guessKind", () => {
  it.each([
    ["How do I list a property", "help"],
    ["Where is my deposit?", "help"],
    ["The page goes blank after I sign in", "bug"],
  ])("reads %j as %s", (message, kind) => {
    expect(guessKind(message)).toBe(kind);
  });
});

describe("titleFrom", () => {
  it("takes the first sentence of the first real line", () => {
    expect(titleFrom("ok\nThe upload fails! It spins forever.")).toBe("The upload fails");
  });

  it("cuts a long message at a word, under 80 characters", () => {
    const title = titleFrom(
      "When I try to upload the title deed for my second property the progress bar stops halfway and never finishes",
    );
    expect(title.endsWith("…")).toBe(true);
    expect(title.length).toBeLessThanOrEqual(81);
    expect(title).not.toMatch(/\s…$/);
  });
});

describe("parseReference", () => {
  it.each([
    ["AF-7KQ2M9", "AF-7KQ2M9"],
    [" af-7kq2m9 ", "AF-7KQ2M9"],
    ["7kq 2m9", "AF-7KQ2M9"],
  ])("reads %j as %s", (input, reference) => {
    expect(parseReference(input)).toBe(reference);
  });

  it.each(["AF-7KQ2M", "AF-7KQ2M0", "XY-7KQ2M9", ""])("rejects %j", (input) => {
    expect(parseReference(input)).toBeNull();
  });
});
