import {gql} from "@apollo/client";
import {ELEMENT_GROUP_FRAGMENT} from "./fragments";

export const CREATE_ELEMENT_GROUP = gql`
    mutation createElementGroup($input: CreateElementGroupInput!) {
        createElementGroup(input: $input) {
            ...ElementGroupFragment
        }
    }
    ${ELEMENT_GROUP_FRAGMENT}
`;

export const DELETE_ELEMENT_GROUP = gql`
    mutation deleteElementGroup($id: ID!) {
        deleteElementGroup(id: $id) {
            id
        }
    }
`;

export const UPDATE_ELEMENT_GROUP = gql`
    mutation updateElementGroup($input: UpdateElementGroupInput!) {
        updateElementGroup(input: $input) {
            ...ElementGroupFragment
        }
    }
    ${ELEMENT_GROUP_FRAGMENT}
`;