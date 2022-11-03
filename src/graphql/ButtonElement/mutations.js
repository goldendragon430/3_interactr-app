import {gql} from "@apollo/client";
import {BUTTON_ELEMENT_FRAGMENT} from "./fragments";

export const CREATE_BUTTON_ELEMENT = gql`
    mutation createButtonElement($input: CreateButtonElementInput!) {
        result: createButtonElement(input: $input) {
            ...ButtonElementFragment
        }
    },
    ${BUTTON_ELEMENT_FRAGMENT}
`;

export const UPDATE_BUTTON_ELEMENT = gql`
    mutation updateButtonElement($input: UpdateButtonElementInput) {
        result: updateButtonElement(input: $input) {
            ...ButtonElementFragment
        }
    },
    ${BUTTON_ELEMENT_FRAGMENT}
`;