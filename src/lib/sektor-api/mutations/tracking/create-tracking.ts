import { gql } from "@apollo/client";

export const CREATE_TRACKING = gql`
  mutation createTracking($input: TrackingInputType!) {
    createTracking(input: $input) {
      _id
    }
  }
`;
