import {gql} from "@apollo/client";
import {AGENCY_FRAGMENT} from "./fragments";
/**
 * Update the agency item mutation
 * @type {DocumentNode}
 */
export const UPDATE_AGENCY = gql`
    mutation updateAgency($input: UpdateAgencyInput!) {
        updateAgency(input: $input) {
            ...AgencyFragment
        }
    }
    ${AGENCY_FRAGMENT}
`;