import { gql } from "@apollo/client";

export const UPDATE_INSURANCE_BROKER_CLIENT_LOGO = gql`
  mutation updateInsuranceBrokerClientLogo($clientId: String!, $logo: File, $organizationId: String!) {
    updateInsuranceBrokerClientLogo(clientId: $clientId, logo: $logo, organizationId: $organizationId) {
      id
      name
    }
  }
`;
