import {gql} from "@apollo/client";
import {FORM_ELEMENT_FRAGMENTS} from "./fragments";

/**
 * Query to get a single form element
 * @type {DocumentNode}
 */
export const GET_FORM_ELEMENT = gql`
    query formElement($id: ID) {
        result: FormElement(id: $id) {
            ...FormElementFragment
        }
    }
    ${FORM_ELEMENT_FRAGMENTS}
`;