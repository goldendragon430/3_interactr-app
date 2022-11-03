import {gql} from "@apollo/client";
import {HOTSPOT_ELEMENT_FRAGMENT} from "./fragments.js";
import {IMAGE_ELEMENT_FRAGMENT} from "../ImageElement/fragments";

export const CREATE_HOTSPOT_ELEMENT = gql`
    mutation createHotspotElement($input: CreateHotspotElementInput) {
        result: createHotspotElement(input: $input) {
            ...HotspotElementFragment
        }
    }
    ${HOTSPOT_ELEMENT_FRAGMENT}
`;

export const UPDATE_HOTSPOT_ELEMENT = gql`
    mutation updateHotspotElement($input: UpdateHotspotElementInput) {
        result: updateHotspotElement(input: $input) {
            ...HotspotElementFragment
        }
    },
    ${HOTSPOT_ELEMENT_FRAGMENT}
`;
