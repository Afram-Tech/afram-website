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
      }
    }
  }
`;
