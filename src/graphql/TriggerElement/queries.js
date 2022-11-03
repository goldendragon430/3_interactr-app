import {gql} from "@apollo/client";
import {TRIGGER_ELEMENT_FRAGMENT} from "./fragments";

/**
 * Query to get a single trigger element
 * @type {DocumentNode}
 */
export const GET_TRIGGER_ELEMENT = gql`
    query triggerElement($id: ID!) {
        result: triggerElement(id: $id) {
            ...TriggerElementFragment
        }
    }
    ${TRIGGER_ELEMENT_FRAGMENT}
`;