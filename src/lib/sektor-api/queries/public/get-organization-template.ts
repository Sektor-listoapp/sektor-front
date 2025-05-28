import { gql } from "@apollo/client";


export const GET_ORGANIZATION_TEMPLATE_QUERY = gql`
query OrganizationTemplate {
    organizationTemplate {
        name
        type
        data
    }
}

`;
