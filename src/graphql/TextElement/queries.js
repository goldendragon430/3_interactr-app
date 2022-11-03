import {gql} from "@apollo/client";
import {TEXT_ELEMENT_FRAGMENT} from "./fragments";

/**
 * Query to get a single text element
 * @type {DocumentNode}
 */
export const GET_TEXT_ELEMENT = gql`
    query textElement($id: ID!) {
        result: TextElement(id: $id) {
            ...TextElementFragment
        }
    }
    ${TEXT_ELEMENT_FRAGMENT}
`;