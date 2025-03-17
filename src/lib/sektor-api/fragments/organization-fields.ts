import { gql } from "@apollo/client";
import { ADDRESS_FIELDS_FRAGMENT } from "./address-fields";

export const ORGANIZATION_RECOGNITION_FIELDS_FRAGMENT = gql`
  fragment OrganizationRecognitionFields on RecognitionType {
    id
    title
    description
    date
    giver
  }
`;

export const ORGANIZATION_STUDY_FIELDS_FRAGMENT = gql`
  fragment studiesFields on StudyType {
    id
    title
    description
    startDate
    endDate
    institution
  }
`;

export const ORGANIZATION_TEAM_MEMBER_FIELDS_FRAGMENT = gql`
  fragment OrganizationTeamMemberFields on TeamMemberType {
    id
    name
    photoUrl
    position
  }
`;

export const ORGANIZATION_CLIENT_FIELDS_FRAGMENT = gql`
  fragment OrganizationClientFields on OrganizationClientType {
    id
    name
    logoUrl
  }
`;

export const ORGANIZATION_OFFICE_SCHEDULE_FIELDS_FRAGMENT = gql`
  fragment OrganizationOfficeScheduleFields on OrganizationOfficeScheduleType {
    fromDay
    toDay
    fromTime
    toTime
  }
`;

export const ORGANIZATION_FIELDS_FRAGMENT = gql`
  fragment OrganizationFields on OrganizationType {
    id
    name
    type
    isActive
    plan
    lineOfBusiness
    coverageStates
    modality
    foundationYear
    createdAt
    updatedAt
    identification
    features {
      featureKey
      value
    }
  }
`;

export const ORGANIZATION_OFFICE_FIELDS_FRAGMENT = gql`
  fragment OrganizationOfficeFields on OrganizationOfficeType {
    id
    phone
    photoUrl
    address {
      ...AddressFields
    }
    schedule {
      ...OrganizationOfficeScheduleFields
    }
  }

  ${ADDRESS_FIELDS_FRAGMENT}
  ${ORGANIZATION_OFFICE_SCHEDULE_FIELDS_FRAGMENT}
`;
