import {gql} from "@apollo/client";
import {PROJECT_GROUP_FRAGMENT} from "./fragments";

export const GET_PROJECT_GROUP = gql`
    query projectGroup($folderId: ID!) {
        result: projectGroup (id: $folderId) {
            ...ProjectGroupFragment
        }      
    }
    ${PROJECT_GROUP_FRAGMENT}
`;

export const GET_PROJECT_GROUPS = gql`
    query projectGroups {
        result: projectGroups {
            ...ProjectGroupFragment
        }
    }
  ${PROJECT_GROUP_FRAGMENT}
`;

export const GET_SELECTED_PROJECT_GROUP = gql`
    query getSelectedProjectGroup {
        result: selectedProjectGroup @client {
            selectedProjectGroup
        }
    }
`;