import {gql} from "@apollo/client";
import {FORM_ELEMENT_FRAGMENTS} from "./fragments";

export const CREATE_FORM_ELEMENT = gql`
    mutation createFormElement($input: CreateFormElementInput!) {
        result: createFormElement(input: $input) {
            ...FormElementFragment
        }
    },
    ${FORM_ELEMENT_FRAGMENTS}
`;


export const UPDATE_FORM_ELEMENT = gql`
    mutation updateFormElement($input: UpdateFormElementInput) {
        result: updateFormElement(input: $input) {
            ...FormElementFragment
        }
    },
    ${FORM_ELEMENT_FRAGMENTS}
`;