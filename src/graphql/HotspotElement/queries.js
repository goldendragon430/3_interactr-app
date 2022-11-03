import {gql} from "@apollo/client";
import {HOTSPOT_ELEMENT_FRAGMENT} from "./fragments.js";

/**
 * Query to get a single hotspot element
 * @type {DocumentNode}
 */
export const GET_HOTSPOT_ELEMENT = gql`
    query hotspotElement($id: ID!) {
        result:  hotspotElement(id: $id) {
            ...HotspotElementFragment
        }
    }
    ${HOTSPOT_ELEMENT_FRAGMENT}
`;