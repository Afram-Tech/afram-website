import { gql } from "@apollo/client";

export const GET_PUBLIC_PROPERTIES = gql`
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
