import {gql} from "@apollo/client";
import {USER_FRAGMENT, SUBUSER_FRAGMENT} from "./fragments";

/**
 * Update the user item
 * @type {DocumentNode}
 */
export const UPDATE_USER = gql`
    mutation updateUser($input: UpdateUserInput!) {
        updateUser(input: $input) {
            ...UserFragment
        }
    }
    ${USER_FRAGMENT}
`;

/**
 * Update the subUser item
 * @type {DocumentNode}
 */
export const UPDATE_SUBUSER = gql`
    mutation updateSubUser($input: UpdateSubUserInput!) {
        updateSubUser(input: $input) {
            ...SubUserFragment
        }
    }
    ${SUBUSER_FRAGMENT}
`;

/**
 * Create a new user item
 * @type {DocumentNode}
 */
export const CREATE_USER = gql`
    mutation createUser($input: CreateUserInput!) {
        createUser(input: $input) {
            ...UserFragment
            parent_user_id
        }
    }
    ${USER_FRAGMENT}
`

/**
 * Delete a single user item
 * @type {DocumentNode}
 */
export const DELETE_USER = gql`
    mutation deleteUser($id: ID!) {
        deleteUser(id: $id) {
            id
            parent_user_id
        }
    }
`