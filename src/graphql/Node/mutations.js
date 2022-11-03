import {gql} from "@apollo/client";
import {NODE_FRAGMENT} from "./fragments";

/**
 * Create a blank project
 * @type {DocumentNode}
 */
export const CREATE_NODE = gql`
    mutation createNode($input: CreateNodeInput!) {
        createNode(input: $input) {
            ...NodeFragment
        }
    }
    ${NODE_FRAGMENT}
`;


/**
 * Update a project
 * @type {DocumentNode}
 */
export const UPDATE_NODE = gql`
    mutation updateNode($input: UpdateNodeInput) {
        updateNode(input: $input) {
            ...NodeFragment
        }
    }
    ${NODE_FRAGMENT}
`;

export const DELETE_NODE = gql`
    mutation deleteNode($id: ID!) {
        deleteNode(id: $id){
            id
            project {
                id
                start_node_id
            }
        }
    }

`;

/**
 * Copy a node
 * @type {DocumentNode}
 */
export const COPY_NODE = gql`
    mutation copyNode($input: CopyNodeInput) {
        copyNode(input: $input) {
            ...NodeFragment
        }
    }
    ${NODE_FRAGMENT}
`;

/**
 * Sort nodes collection by sort_order column
 * @type {DocumentNode}
 */
export const SORT_NODES_COLLECTION = gql`
    mutation sortNodes($input: SortNodesInput!) {
        sortNodes(input: $input)
    }
`;