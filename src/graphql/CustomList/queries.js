import {gql} from "@apollo/client";
import {CUSTOM_LISTS_FRAGMENT} from "./fragments";

/**
 * Query the custom lists
 * @type {DocumentNode}
 */
export const GET_CUSTOM_LISTS = gql`
    query customLists {
        result: customLists {
            ...CustomListsFragment
        }
    }
    ${CUSTOM_LISTS_FRAGMENT}
`;