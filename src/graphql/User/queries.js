import {gql} from "@apollo/client";
import {SUBUSER_FRAGMENT, USER_FRAGMENT} from './fragments';
import {PAGINATOR_FIELDS} from "../utils";

/**
 * User query
 * @type {DocumentNode}
 */
export const GET_USER = gql`  
    query User ($id: ID!) {
        result: user (id: $id) {
            ...UserFragment
        }
    }
    ${USER_FRAGMENT}
`;

/**
 * Users query
 * @type {DocumentNode}
 */
export const GET_USERS = gql`
    query Users (
        $search: String, 
        $page: Int!, 
        $first: Int!
    ) {
        result: users (search: $search, page: $page, first: $first) {
            data {
                ...UserFragment
            }
            paginatorInfo {
                ...PaginatorFragment
            }
        }
    }
    ${USER_FRAGMENT}
    ${PAGINATOR_FIELDS}
`;

export const GET_AUTH_USER = gql`
    query AuthUser {
        result: me {
            ...UserFragment
        }
    }
    ${USER_FRAGMENT}
`;

export const GET_SUBUSER = gql`
    query SubUser (
        $id: ID!,
    ) {
        subUser (
            id: $id,
        ) {
            ...SubUserFragment
        }
    }
    ${SUBUSER_FRAGMENT}
`;

export const GET_SUBUSERS = gql`
    query SubUsers (
        $search: String,
        $page: Int!,
        $first: Int!,
        $parent_user_id: Int!
    ) {
        result: subUsers (
            search: $search,
            page: $page,
            first: $first,
            parent_user_id: $parent_user_id
        ) {
            data {
                ...SubUserFragment
            }
            paginatorInfo {
                ...PaginatorFragment
            }
        }
    }
    ${SUBUSER_FRAGMENT}
    ${PAGINATOR_FIELDS}
`;