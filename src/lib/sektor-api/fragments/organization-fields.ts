import { gql } from "@apollo/client";
import { ADDRESS_FIELDS_FRAGMENT } from "./address-fields";

export const ORGANIZATION_TEAM_MEMBER_FIELDS_FRAGMENT = gql`
  fragment OrganizationTeamMemberFields on OrganizationTeamMemberType {
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
    day
    from
    to
  }
`;

export const ORGANIZATION_OFFICE_FIELDS_FRAGMENT = gql`
  fragment OrganizationOfficeFields on OrganizationOfficeType {
    id
    phone
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
