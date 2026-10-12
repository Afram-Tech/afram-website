import { gql } from "@apollo/client";

/** Public — the Afram web app's contact form sends it signed out too. */
export const CONTACT_US = gql`
  mutation ContactUs($input: ContactUsInput!) {
    contactUs(input: $input) {
      success
      message
    }
  }
`;
