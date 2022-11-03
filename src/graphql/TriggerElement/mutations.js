import {gql} from "@apollo/client";
import {TRIGGER_ELEMENT_FRAGMENT} from "./fragments";

export const CREATE_TRIGGER_ELEMENT = gql`
    mutation createTriggerElement($input: CreateTriggerElementInput!) {
        result: createTriggerElement(input: $input) {
            ...TriggerElementFragment
        }
    },
    ${TRIGGER_ELEMENT_FRAGMENT}
`;