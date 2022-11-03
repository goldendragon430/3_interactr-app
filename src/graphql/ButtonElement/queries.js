import {gql} from "@apollo/client";
import {BUTTON_ELEMENT_FRAGMENT} from "./fragments";

/**
 *  Query to get a single button element
 * @type {DocumentNode}
 */
export const GET_BUTTON_ELEMENT = gql`
    query buttonElement($id: ID!) {
        result: buttonElement(id: $id) {
            ...ButtonElementFragment
        }
    }
    ${BUTTON_ELEMENT_FRAGMENT}
`;