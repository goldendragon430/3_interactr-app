import {gql} from "@apollo/client";
import {INTERACTION_FRAGMENT} from "./fragments";

export const UPDATE_INTERACTION = gql`
    mutation updateUser($input: UpdateInteractionInput!) {
        updateInteraction(input: $input) {
            ...InteractionFragment
        }
    }
    ${INTERACTION_FRAGMENT}
`;

export const DELETE_INTERACTION = gql`
    mutation deleteInteraction($id: ID!) {
        deleteInteraction(id: $id) {
            id
        }
    }
`;

export const CREATE_INTERACTION = gql`
    mutation createInteraction($input: CreateInteractionInput!) {
        result: createInteraction(input: $input) {
            ...InteractionFragment
        }
    }
    ${INTERACTION_FRAGMENT}
`;

export const COPY_INTERACTION = gql`
    mutation copyInteraction($input: CopyInteractionInput!) {
        result: copyInteraction(input: $input) {
            ...InteractionFragment
        }
    }
    ${INTERACTION_FRAGMENT}
`;