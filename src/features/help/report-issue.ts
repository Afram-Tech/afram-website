import { z } from "zod";

/**
 * Report an issue from /help. Reports are filed into the Exchange's report
 * intake (`api/report`), the same place in-app reports go (and where Linear
 * picks them up), so the option ids below must match the Exchange's.
 */

export const REPORT_KINDS = [
  { id: "bug", label: "Something's broken" },
  { id: "help", label: "I need help" },
] as const;

export const REPORT_AREAS = [
  { id: "access", label: "Signing in or my account" },
  { id: "verification", label: "Onboarding and ID verification" },
  { id: "listings", label: "Listing a property or project" },
  { id: "buying", label: "Browsing or expressing interest" },
  { id: "financing", label: "Financing and offers" },
  { id: "transactions", label: "Transactions and payments" },
  { id: "messaging", label: "Messaging" },
  { id: "notifications", label: "Notifications" },
  { id: "settings", label: "Settings and users" },
  { id: "other", label: "Something else" },
] as const;

export const REPORT_IMPACTS = [
  { id: "blocked", label: "I can't continue" },
  { id: "workaround", label: "I found a way around it" },
  { id: "minor", label: "Minor" },
] as const;

type Ids<T extends readonly { id: string }[]> = [T[number]["id"], ...T[number]["id"][]];
const ids = <T extends readonly { id: string }[]>(options: T) =>
  options.map((option) => option.id) as Ids<T>;

const ReportSchema = z.object({
  kind: z.enum(ids(REPORT_KINDS), { message: "Choose what's happening." }),
  area: z.enum(ids(REPORT_AREAS), { message: "Choose what it's about." }),
  impact: z.enum(ids(REPORT_IMPACTS), { message: "Choose how much it's affecting you." }),
  title: z
    .string()
    .trim()
    .min(5, "Add a short summary (5+ characters).")
    .max(120, "Keep the summary under 120 characters."),
  details: z
    .string()
    .trim()
    .min(10, "Tell us a little more (10+ characters).")
    .max(4000, "Keep the details under 4,000 characters."),
  email: z.union([z.literal(""), z.email("Enter a valid email, or leave it blank.")]),
  path: z.string().max(200).optional(),
  userAgent: z.string().max(400).optional(),
  viewport: z.string().max(40).optional(),
  language: z.string().max(40).optional(),
});

export type ReportField = "kind" | "area" | "impact" | "title" | "details" | "email";

export type ReportState =
  | { status: "idle" }
  | { status: "error"; message: string; field?: ReportField }
  | { status: "sent"; reference: string };

/** The body the Exchange's `api/report` takes. */
export interface ReportPayload {
  kind: string;
  area: string;
  impact: string;
  title: string;
  details: string;
  screenshots: string[];
  context: Record<string, string>;
}

const FIELDS: readonly string[] = ["kind", "area", "impact", "title", "details", "email"];

const text = (form: FormData, name: string) => {
  const value = form.get(name);
  return typeof value === "string" ? value : undefined;
};

export function parseIssueReport(
  form: FormData,
  reportedAt = new Date(),
): { ok: true; payload: ReportPayload } | { ok: false; state: ReportState } {
  const parsed = ReportSchema.safeParse({
    kind: text(form, "kind"),
    area: text(form, "area"),
    impact: text(form, "impact"),
    title: text(form, "title") ?? "",
    details: text(form, "details") ?? "",
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
      kind: d.kind,
      area: d.area,
      impact: d.impact,
      title: d.title,
      details: d.details,
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
