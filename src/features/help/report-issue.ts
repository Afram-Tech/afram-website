import { z } from "zod";

/**
 * Report an issue from /help. Reports are filed into the Exchange's report
 * intake (`api/report`), the same place in-app reports go (and where Linear
 * picks them up). The visitor writes one message; kind, summary and urgency
 * are filled in from it, as in the Exchange's own Help.
 */

const ReportSchema = z.object({
  message: z
    .string()
    .trim()
    .min(10, "Tell us a little more, so we can find the problem.")
    .max(4000, "Keep this under 4,000 characters."),
  blocked: z.boolean(),
  email: z.union([z.literal(""), z.email("Enter a valid email, or leave it blank.")]),
  path: z.string().max(200).optional(),
  userAgent: z.string().max(400).optional(),
  viewport: z.string().max(40).optional(),
  language: z.string().max(40).optional(),
});

export type ReportField = "message" | "email";

export type ReportState =
  | { status: "idle" }
  | { status: "error"; message: string; field?: ReportField }
  | { status: "sent"; reference: string };

/** The body the Exchange's `api/report` takes. */
export interface ReportPayload {
  kind: "bug" | "help";
  area: string;
  impact: "blocked" | "workaround";
  title: string;
  details: string;
  screenshots: string[];
  context: Record<string, string>;
}

const FIELDS: readonly string[] = ["message", "email"];

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
    blocked: Boolean(text(form, "blocked")),
    email: (text(form, "email") ?? "").trim(),
    path: text(form, "path"),
    userAgent: text(form, "userAgent"),
    viewport: text(form, "viewport"),
    language: text(form, "language"),
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
  return {
    ok: true,
    payload: {
      kind: guessKind(d.message),
      area: "other",
      impact: d.blocked ? "blocked" : "workaround",
      title: titleFrom(d.message),
      details: d.message,
      screenshots: [],
      context: {
        page: "Website · Help",
        role: "Website visitor",
        reporter: d.email || "Not given",
        path: d.path || "/help",
        userAgent: d.userAgent ?? "",
        viewport: d.viewport ?? "",
        language: d.language ?? "",
        build: "afram-website",
        reportedAt: reportedAt.toISOString(),
      },
    },
  };
}
