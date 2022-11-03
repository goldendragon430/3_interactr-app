import {gql} from "@apollo/client";
import {TEXT_ELEMENT_FRAGMENT} from "./fragments";

export const CREATE_TEXT_ELEMENT = gql`
    mutation createTextElement($input: CreateTextElementInput) {
        result: createTextElement(input: $input) {
            ...TextElementFragment
        }
    },
    ${TEXT_ELEMENT_FRAGMENT}
`;