import { z } from "zod";

import type { SubmitSupportRequestInput, SupportStatus } from "@/types/generated/graphql";

/**
 * Report an issue from /help. Filed with the API's public
 * `submitSupportRequest`, the same support requests in-app Help sends (the
 * team works them in Linear). The visitor writes one message; kind and
 * summary are filled in from it, as in the app's own Help.
 */

const ReportSchema = z.object({
  message: z
    .string()
    .trim()
    .min(10, "Tell us a little more, so we can find the problem.")
    .max(4000, "Keep this under 4,000 characters."),
  email: z.union([z.literal(""), z.email("Enter a valid email, or leave it blank.")]),
  path: z.string().max(200).optional(),
  userAgent: z.string().max(400).optional(),
  viewport: z.string().max(40).optional(),
  language: z.string().max(40).optional(),
  captchaToken: z.string().max(4096).optional(),
  idempotencyKey: z.string().max(100).optional(),
});

export type ReportField = "message" | "email";

export type ReportState =
  | { status: "idle" }
  | { status: "error"; message: string; field?: ReportField }
  | { status: "sent"; reference: string };

/** What `submitSupportRequest` takes. */
export type ReportPayload = SubmitSupportRequestInput;

const FIELDS: readonly string[] = ["message", "email"];

const BODY_MAX = 4000;

/** The line the message ends with when they gave an email, so whoever reads
 *  it — in our admin or in Linear — sees where to answer. */
export const replyLine = (email: string) => (email ? `\n\nReply to: ${email}` : "");

/** A question reads as a request for help; anything else as something broken. */
export const guessKind = (message: string): ReportPayload["kind"] =>
  /\?|\b(how (do|can|to)|where (is|are|do|can)|what (is|does)|can i|is it possible)\b/i.test(
    message,
  )
    ? "help"
    : "bug";

/** A short summary: the first sentence of the first real line, cut to ~80 characters. */
export function titleFrom(message: string) {
  const flat = message.replace(/\s+/g, " ").trim();
  const line =
    message
      .split(/\n/)
      .map((l) => l.trim())
      .find((l) => l.length >= 5) ?? flat;
  const sentence = (line.match(/^.+?[.!?](\s|$)/)?.[0] ?? line).trim();
  const base = sentence.length >= 5 ? sentence : flat;
  if (base.length <= 80) return base.replace(/[.!]+$/, "");
  const cut = base.slice(0, 80);
  return `${cut.slice(0, Math.max(cut.lastIndexOf(" "), 40)).trim()}…`;
}

const text = (form: FormData, name: string) => {
  const value = form.get(name);
  return typeof value === "string" ? value : undefined;
};

export function parseIssueReport(
  form: FormData,
  reportedAt = new Date(),
): { ok: true; payload: ReportPayload } | { ok: false; state: ReportState } {
  const parsed = ReportSchema.safeParse({
    message: text(form, "message") ?? "",
    email: (text(form, "email") ?? "").trim(),
    path: text(form, "path"),
    userAgent: text(form, "userAgent"),
    viewport: text(form, "viewport"),
    language: text(form, "language"),
    captchaToken: text(form, "captchaToken"),
    idempotencyKey: text(form, "idempotencyKey"),
  });

  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    const field = String(issue?.path[0] ?? "");
    return {
      ok: false,
      state: {
        status: "error",
        message: issue?.message ?? "Please check the form.",
        ...(FIELDS.includes(field) && { field: field as ReportField }),
      },
    };
  }

  const d = parsed.data;
  const body = `${d.message}${replyLine(d.email)}`;
  if (body.length > BODY_MAX) {
    return {
      ok: false,
      state: {
        status: "error",
        message: `Keep this under ${(BODY_MAX - replyLine(d.email).length).toLocaleString("en-GB")} characters.`,
        field: "message",
      },
    };
  }
  return {
    ok: true,
    payload: {
      // One per message, made in the browser: a resend after a dropped
      // connection can't file it twice.
      idempotencyKey: d.idempotencyKey || crypto.randomUUID(),
      replyEmail: d.email || null,
      kind: guessKind(d.message),
      area: "other",
      title: titleFrom(d.message),
      // The email goes in the message too, so it travels with their words.
      body,
      captchaToken: d.captchaToken ?? "",
      context: {
        screen: "Website Help",
        path: d.path || "/help",
        userAgent: d.userAgent ?? "",
        viewport: d.viewport ?? "",
        language: d.language ?? "",
        appVersion: "afram-website",
        reportedAt: reportedAt.toISOString(),
      },
    },
  };
}

/* ── Track a request ─────────────────────────────────────────────────── */

export type RequestState = "received" | "in_progress" | "resolved";

export type ReportCheck =
  | { status: "found"; reference: string; state: RequestState; updatedAt?: string }
  | { status: "not_found"; reference: string }
  | { status: "error" };

/** The API's status on the visitor's three steps. "Waiting on member" is
 *  still the team's; a status added later reads as "Team on it". */
export const stateFrom = (status: SupportStatus | string): RequestState =>
  status === "open"
    ? "received"
    : status === "resolved" || status === "closed"
      ? "resolved"
      : "in_progress";

const REFERENCE = /^AF-[ABCDEFGHJKMNPQRSTUVWXYZ23456789]{6}$/;

/**
 * A reference as the Exchange issues it (`AF-` and 6 letters and numbers), or
 * null when it can't be one. Case, spaces and a missing `AF-` don't matter.
 */
export function parseReference(input: string) {
  const raw = input.trim().toUpperCase().replace(/\s+/g, "");
  const reference = /^[A-Z0-9]{6}$/.test(raw) ? `AF-${raw}` : raw;
  return REFERENCE.test(reference) ? reference : null;
}
