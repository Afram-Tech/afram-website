/**
 * GraphQL documents are inlined rather than read from `.graphql` files at
 * runtime: the Workers runtime has no filesystem, so `readFileSync` throws.
 * The `/* GraphQL *\/` comment keeps graphql-codegen able to extract them.
 */
export const GET_PUBLIC_PROPERTIES = /* GraphQL */ `
  query GetPublicProperties($pagination: Pagination) {
    getPublicProjects(pagination: $pagination) {
      id
      projectType
      property {
        id
        price
        currency
        propertyType
        status
        bedroom
        fullBathroom
        halfBathroom
        squareFeet
        city
        region
        propertyNameOrNumber
        propertyDescription
        propertyCardDesc
        propertyAmenities
        titleType
        landCertificateNumber
        projectImages
        thumbnail
        streetAddress
        gpsAddress
        metadata
        siteCoordinates
      }
    }
  }
`;

/** Public — Afram is invite-only; this files a request staff review in the
 *  admin dashboard. Answers `success: true` even for an email that already has
 *  an account or a waiting request, so it never reveals who is registered. */
export const REQUEST_ACCESS = /* GraphQL */ `
  mutation RequestAccess($input: RequestAccessInput!) {
    requestAccess(input: $input) {
      success
      message
    }
  }
`;

/** Public — the Afram web app's contact form sends it signed out too. */
export const CONTACT_US = /* GraphQL */ `
  mutation ContactUs($input: ContactUsInput!) {
    contactUs(input: $input) {
      success
      message
    }
  }
`;
