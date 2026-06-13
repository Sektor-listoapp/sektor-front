import { gql } from "@apollo/client";

export const HOME_INTERMEDIARIES_STATS_QUERY = gql`
  query getHomeIntermediariesStats {
    publicInsuranceBrokers(pagination: { offset: 0, limit: 1 }) {
      count
    }
    publicExclusiveAgents(pagination: { offset: 0, limit: 1 }) {
      count
    }
    publicBrokerageSocieties(pagination: { offset: 0, limit: 1 }) {
      count
    }
    totalQuotesCount
  }
`;
