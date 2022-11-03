import {gql} from "@apollo/client";
import {CUSTOM_HTML_ELEMENT_FRAGMENT} from "./fragments";

export const CREATE_HTML_ELEMENT = gql`
    mutation createCustomHtmlElement($input: CreateCustomHtmlElementInput!) {
        result: createCustomHtmlElement(input: $input) {
            ...CustomHtmlElementFragment
        }
    },
    ${CUSTOM_HTML_ELEMENT_FRAGMENT}
`;

export const UPDATE_HTML_ELEMENT = gql`
    mutation updateCustomHtmlElement($input: UpdateCustomHtmlElementInput) {
        result: updateCustomHtmlElement(input: $input) {
            ...CustomHtmlElementFragment
        }
    }
    ${CUSTOM_HTML_ELEMENT_FRAGMENT}
`;