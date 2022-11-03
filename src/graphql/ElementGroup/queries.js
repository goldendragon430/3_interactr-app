import {gql} from "@apollo/client";
import {ELEMENT_GROUP_FRAGMENT} from "./fragments";

/**
 * Element Groups query
 * @type {DocumentNode}
 */
export const GET_ELEMENT_GROUPS = gql`
    query elementGroups($nodeId: Int!) {
        result: elementGroups(node_id: $nodeId) {
            ...ElementGroupFragment
        }
    }
    ${ELEMENT_GROUP_FRAGMENT}
`;