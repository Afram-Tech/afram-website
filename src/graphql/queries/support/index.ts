import { gql } from "@apollo/client";

/** Public — where a signed-out request is, by its reference and the email it
 *  was sent with. Status and dates only, never its messages. Null when either
 *  doesn't match. */
export const getSupportRequestStatus = gql`
  query GetSupportRequestStatus($reference: String!, $replyEmail: String!) {
    getSupportRequestStatus(reference: $reference, replyEmail: $replyEmail) {
      reference
      status
      updatedAt
    }
  }
`;
