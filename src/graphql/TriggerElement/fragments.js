import {gql}  from '@apollo/client';



/**
 * Fragment for the trigger element fields
 * @type {DocumentNode}
 */
export const TRIGGER_ELEMENT_FRAGMENT = gql`
    fragment TriggerElementFragment on TriggerElement {
        id
        created_at
        action
        actionArg
        name
    }
`;