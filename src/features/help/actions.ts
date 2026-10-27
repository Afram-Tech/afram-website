"use server";

import { CombinedGraphQLErrors } from "@apollo/client";

import { getClient } from "@/graphql/client";
import { submitSupportRequest } from "@/graphql/mutations";
import { getSupportRequestStatus } from "@/graphql/queries";
import type {
  GetSupportRequestStatusQuery,
  GetSupportRequestStatusQueryVariables,
  SubmitSupportRequestMutation,
  SubmitSupportRequestMutationVariables,
} from "@/types/generated/graphql";

import {
  parseIssueReport,
  parseReference,
  stateFrom,
  type ReportCheck,
  type ReportField,
  type ReportState,
} from "./report-issue";

const SEND_FAILED: ReportState = {
  status: "error",
  message: "We couldn't send your message. Please try again.",
};

/** The API's input fields the form has a box for. */
const FIELD_FOR: Record<string, ReportField> = { body: "message", replyEmail: "email" };

/**
 * A refusal the visitor can fix comes back as a GraphQL error with a message
 * written for people (spec 1.7) and the input it's about. Shown as written,
 * against its field when there is one.
 */
function refusal(error: unknown): ReportState {
  if (!CombinedGraphQLErrors.is(error) || !error.errors[0]) return SEND_FAILED;
  const first = error.errors[0];
  const path = first.extensions?.field;
  const field = Array.isArray(path) ? FIELD_FOR[String(path[path.length - 1])] : undefined;
  return { status: "error", message: first.message, ...(field && { field }) };
}

/** "Report an issue": the public `submitSupportRequest`, from the server. */
export async function reportIssue(_previous: ReportState, form: FormData): Promise<ReportState> {
  const report = parseIssueReport(form);
  if (!report.ok) return report.state;

  try {
    const { data } = await getClient().mutate<
      SubmitSupportRequestMutation,
      SubmitSupportRequestMutationVariables
    >({ mutation: submitSupportRequest, variables: { input: report.payload } });
    const reference = data?.submitSupportRequest.reference;
    return reference ? { status: "sent", reference } : SEND_FAILED;
  } catch (error) {
    return refusal(error);
  }
}

/**
 * Where a request is, by its reference and the email it was sent with — the
 * API matches both, so a reference alone reveals nothing. Status and the last
 * change only, never its messages. Never cached: it's checked for news.
 */
export async function checkReport(input: string, email: string): Promise<ReportCheck> {
  const reference = parseReference(input);
  const replyEmail = email.trim();
  if (!reference || !replyEmail) return { status: "not_found", reference: input.trim() };

  try {
    const { data } = await getClient().query<
      GetSupportRequestStatusQuery,
      GetSupportRequestStatusQueryVariables
    >({
      query: getSupportRequestStatus,
      variables: { reference, replyEmail },
      fetchPolicy: "no-cache",
      context: { fetchOptions: { next: { revalidate: 0 } } },
    });
    const found = data?.getSupportRequestStatus;
    if (!found) return { status: "not_found", reference };
    return {
      status: "found",
      reference: found.reference,
      state: stateFrom(found.status),
      updatedAt: found.updatedAt as string,
    };
  } catch {
    return { status: "error" };
  }
}
