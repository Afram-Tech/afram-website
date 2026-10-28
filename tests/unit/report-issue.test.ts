import { CombinedGraphQLErrors } from "@apollo/client";
import { describe, expect, it } from "vitest";

import {
  checkFrom,
  guessKind,
  parseIssueReport,
  parseReference,
  refusal,
  SEND_FAILED,
  stateFrom,
  titleFrom,
} from "@/features/help/report-issue";

const form = (fields: Record<string, string>) => {
  const data = new FormData();
  for (const [name, value] of Object.entries(fields)) data.set(name, value);
  return data;
};

const VALID = {
  message: "  My access link says it has expired. I opened it straight from the email.  ",
  email: " ama@email.com ",
  path: "/help",
  userAgent: "Test",
  viewport: "390×844",
  language: "en-GH",
  captchaToken: "turnstile-token",
  idempotencyKey: "6f1c2a4e-8b0d-4a8e-9a55-1d2c3b4a5e6f",
};

describe("parseIssueReport", () => {
  it("builds submitSupportRequest's input from one message, with the visitor's context", () => {
    const result = parseIssueReport(form(VALID), new Date("2026-10-19T09:00:00.000Z"));

    expect(result).toEqual({
      ok: true,
      payload: {
        idempotencyKey: "6f1c2a4e-8b0d-4a8e-9a55-1d2c3b4a5e6f",
        replyEmail: "ama@email.com",
        kind: "bug",
        area: "other",
        title: "My access link says it has expired",
        body: "My access link says it has expired. I opened it straight from the email.\n\nReply to: ama@email.com",
        captchaToken: "turnstile-token",
        context: {
          screen: "Website Help",
          path: "/help",
          userAgent: "Test",
          viewport: "390×844",
          language: "en-GH",
          appVersion: "afram-website",
          reportedAt: "2026-10-19T09:00:00.000Z",
        },
      },
    });
  });

  it("keeps the message within 4,000 characters with the email line added", () => {
    const result = parseIssueReport(
      form({ ...VALID, message: "a".repeat(3995), email: "ama@email.com" }),
    );
    expect(result).toEqual({
      ok: false,
      state: { status: "error", message: "Keep this under 3,975 characters.", field: "message" },
    });
  });

  it("makes a send key when the browser didn't give one", () => {
    const result = parseIssueReport(form({ ...VALID, idempotencyKey: "" }));
    expect(result.ok && result.payload.idempotencyKey).toMatch(/^[0-9a-f-]{36}$/);
  });

  it.each([
    ["message", { message: "Broken" }, "Tell us a little more, so we can find the problem."],
    ["email", { email: "" }, "Add your email, so we can reply and you can track this."],
    ["email", { email: "   " }, "Add your email, so we can reply and you can track this."],
    ["email", { email: "not-an-email" }, "Enter a valid email."],
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

describe("stateFrom", () => {
  it.each([
    ["open", "received"],
    ["in_progress", "in_progress"],
    ["waiting_on_member", "in_progress"],
    ["resolved", "resolved"],
    ["closed", "resolved"],
    ["something_new", "in_progress"],
  ])("reads %s as %s", (status, state) => {
    expect(stateFrom(status)).toBe(state);
  });
});

describe("refusal", () => {
  const graphQLError = (message: string, field?: string[]) =>
    new CombinedGraphQLErrors({
      errors: [{ message, ...(field && { extensions: { field } }) }],
    });

  it("shows the API's message against the box it's about", () => {
    expect(
      refusal(graphQLError("That email can't receive mail.", ["input", "replyEmail"])),
    ).toEqual({
      status: "error",
      message: "That email can't receive mail.",
      field: "email",
    });
  });

  it("shows a message about no box on its own", () => {
    expect(refusal(graphQLError("Please try the check again."))).toEqual({
      status: "error",
      message: "Please try the check again.",
    });
  });

  it("falls back to a general failure for anything else", () => {
    expect(refusal(new TypeError("Failed to fetch"))).toBe(SEND_FAILED);
  });
});

describe("checkFrom", () => {
  it("reads a found request onto the tracker's steps", () => {
    expect(
      checkFrom("AF-7KQ2M9", {
        reference: "AF-7KQ2M9",
        status: "open" as never,
        updatedAt: "2026-10-28T09:00:00.000Z",
      }),
    ).toEqual({
      status: "found",
      reference: "AF-7KQ2M9",
      state: "received",
      updatedAt: "2026-10-28T09:00:00.000Z",
    });
  });

  it("is not found when the reference and email don't match", () => {
    expect(checkFrom("AF-7KQ2M9", null)).toEqual({ status: "not_found", reference: "AF-7KQ2M9" });
  });
});
