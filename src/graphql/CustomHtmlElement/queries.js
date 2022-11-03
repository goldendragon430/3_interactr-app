import {gql} from "@apollo/client";
import {CUSTOM_HTML_ELEMENT_FRAGMENT} from "./fragments";

/**
 * Query to get a single custom html element
 * @type {DocumentNode}
 */
export const GET_CUSTOM_HTML_ELEMENT= gql`
    query customHtmlElement($id: ID!) {
        result: CustomHtmlElement(id: $id) {
            ...CustomHtmlElementFragment
        }
    }
    ${CUSTOM_HTML_ELEMENT_FRAGMENT}
`;