import {gql} from "@apollo/client";
import {IMAGE_ELEMENT_FRAGMENT} from "./fragments";

/**
 * Query to get single Image element
 * @type {DocumentNode}
 */
export const GET_IMAGE_ELEMENT = gql`
    query imageElement($id: ID!) {
        result: ImageElement(id: $id) {
            ...ImageElementFragment
        }
    }
    ${IMAGE_ELEMENT_FRAGMENT}
`;