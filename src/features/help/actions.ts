"use server";

import {
  parseIssueReport,
  parseReference,
  type ReportCheck,
  type ReportState,
} from "./report-issue";

/** The Exchange's report intake. Sent from the server, so no CORS is involved. */
const DEFAULT_REPORT_API = "https://afram-exchange-v2.vercel.app/api/report";
const reportApi = () => process.env.AFRAM_REPORT_API_URL || DEFAULT_REPORT_API;

const SEND_FAILED: ReportState = {
  status: "error",
  message: "We couldn't send your message. Please try again.",
};

export async function reportIssue(_previous: ReportState, form: FormData): Promise<ReportState> {
  const report = parseIssueReport(form);
  if (!report.ok) return report.state;

  try {
    const response = await fetch(reportApi(), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
      body: JSON.stringify(report.payload),
      signal: AbortSignal.timeout(10_000),
    });
    const data = (await response.json().catch(() => ({}))) as {
      reference?: string;
      message?: string;
    };
    if (!response.ok || !data.reference) {
      return data.message ? { status: "error", message: data.message } : SEND_FAILED;
    }
    return { status: "sent", reference: data.reference };
  } catch {
    return SEND_FAILED;
  }
}

/** Where a request is, by the reference it was given. Status and dates only, never its content. */
export async function checkReport(input: string): Promise<ReportCheck> {
  const reference = parseReference(input);
  if (!reference) return { status: "not_found", reference: input.trim() };

  try {
    const url = new URL(reportApi());
    url.searchParams.set("refs", reference);
    const response = await fetch(url, { cache: "no-store", signal: AbortSignal.timeout(10_000) });
    if (!response.ok) return { status: "error" };
    const data = (await response.json()) as {
      statuses?: Record<string, string>;
      times?: Record<string, { receivedAt: string; updatedAt?: string }>;
    };
    const state = data.statuses?.[reference];
    if (state !== "received" && state !== "in_progress" && state !== "resolved") {
      return { status: "not_found", reference };
    }
    return { status: "found", reference, state, ...data.times?.[reference] };
  } catch {
    return { status: "error" };
  }
}
