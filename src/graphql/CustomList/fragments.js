import {gql} from "@apollo/client";


/**
 * Fields required for the custom lists
 * @type {DocumentNode}
 */
export const CUSTOM_LISTS_FRAGMENT = gql`    
    fragment CustomListsFragment on CustomLists {
        id
        custom_list_name
        emails {
            id
            name
            email
        }
    }
`;