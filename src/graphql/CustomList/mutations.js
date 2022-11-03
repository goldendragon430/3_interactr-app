import {gql} from "@apollo/client";
import {CUSTOM_LISTS_FRAGMENT} from "./fragments";

/**
 * Create a custom list
 * @type {DocumentNode}
 */
export const CREATE_CUSTOM_LIST = gql`
    mutation createCustomList($input: CreateCustomListInput!) {
        createCustomList(input: $input) {
            ...CustomListsFragment
        }
    }
    ${CUSTOM_LISTS_FRAGMENT}
`;

/**
 * Delete a single custom list
 */
export const DELETE_CUSTOM_LIST = gql`
    mutation deleteCustomList($id: ID!) {
        deleteCustomList(id: $id) {
            id
        }
    }
`;