import {gql} from "@apollo/client";
import {INTERACTION_FRAGMENT} from "./fragments";

/**
 * Query a list of interactions
 * @type {DocumentNode}
 */
export const GET_INTERACTIONS = gql`
    query interactions($nodeId: Int!) {
        result: interactions(node_id: $nodeId) {
            ...InteractionFragment
        }
    }
    ${INTERACTION_FRAGMENT}
`;

/**
 * Query a single interaction
 * @type {DocumentNode}
 */
export const GET_INTERACTION = gql`
    query Interaction($id: ID!) {
        result: interaction(id: $id) {
            ...InteractionFragment
        }
    }
    ${INTERACTION_FRAGMENT}
`;
