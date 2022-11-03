import {gql} from "@apollo/client";
import {INTERACTION_FRAGMENT} from "../Interaction/fragments";
import {MEDIA_FRAGMENT} from "../Media/fragments";
import {ELEMENT_GROUP_FRAGMENT} from "../ElementGroup/fragments";

export const NODE_FRAGMENT = gql`
    fragment NodeFragment on Node {
        id
        project_id
        name
        posX
        posY
        completeAction
        completeActionArg
        completeActionDelay
        completeActionTimer
        completeActionSound
        completeAnimation
        loop
        interaction_layer_id
        sort_order
        duration
        media_id
        created_at
        media {
            ...MediaFragment
        }
        enable_interaction_layer
        background_color
        element_groups {
            ...ElementGroupFragment
        }
        interactions {
            ...InteractionFragment
        }
    }
    ${MEDIA_FRAGMENT}
    ${INTERACTION_FRAGMENT}
    ${ELEMENT_GROUP_FRAGMENT}
`;