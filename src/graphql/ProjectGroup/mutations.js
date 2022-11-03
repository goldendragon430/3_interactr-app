import {gql} from "@apollo/client";
import {PROJECT_GROUP_FRAGMENT} from "./fragments";

export const CREATE_PROJECT_GROUP = gql`
    mutation createProjectGroup($input: CreateProjectGroupInput!) {
        createProjectGroup(input: $input) {
            ...ProjectGroupFragment
        }
    }
  ${PROJECT_GROUP_FRAGMENT}
`;

export const DELETE_PROJECT_GROUP = gql`
    mutation deleteProjectGroup($id: ID!) {
        deleteProjectGroup(id: $id) {
            ...ProjectGroupFragment
        }
    }
    ${PROJECT_GROUP_FRAGMENT}
`;

export const UPDATE_PROJECT_GROUP = gql`
    mutation updateProjectGroup($input: UpdateProjectGroupInput!) {
        updateProjectGroup(input: $input) {
            ...ProjectGroupFragment
        }
    }
    ${PROJECT_GROUP_FRAGMENT}
`;

export const UPDATE_PROJECT_GROUPS_SORTING = gql`
    mutation updateProjectGroupsSorting($input: UpdateProjectGroupsSortingInput!) {
        updateProjectGroupsSorting(input: $input) {
            id
            sort_order_number
        }
    }
`;