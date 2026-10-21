"use server";

import { parseIssueReport, type ReportState } from "./report-issue";

/** The Exchange's report intake. Sent from the server, so no CORS is involved. */
const DEFAULT_REPORT_API = "https://afram-exchange-v2.vercel.app/api/report";

const SEND_FAILED: ReportState = {
  status: "error",
  message: "We couldn't send your report. Please try again.",
};

export async function reportIssue(_previous: ReportState, form: FormData): Promise<ReportState> {
  const report = parseIssueReport(form);
  if (!report.ok) return report.state;

  try {
    const response = await fetch(process.env.AFRAM_REPORT_API_URL || DEFAULT_REPORT_API, {
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
