import { gql } from "@apollo/client";

/** Public — the Help page's "Report an issue". Files a support request the
 *  team works in Linear; the visitor gets only the reference back. */
export const submitSupportRequest = gql`
  mutation SubmitSupportRequest($input: SubmitSupportRequestInput!) {
    submitSupportRequest(input: $input) {
      reference
    }
  }
`;
