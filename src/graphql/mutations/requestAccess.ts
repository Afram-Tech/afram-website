import { gql } from "@apollo/client";

/** Public — Afram is invite-only; this files a request staff review in the
 *  admin dashboard. Answers `success: true` even for an email that already has
 *  an account or a waiting request, so it never reveals who is registered. */
export const requestAccess = gql`
  mutation RequestAccess($input: RequestAccessInput!) {
    requestAccess(input: $input) {
      success
      message
    }
  }
`;
