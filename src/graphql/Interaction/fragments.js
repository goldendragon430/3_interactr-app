import {gql}  from '@apollo/client';
import {BUTTON_ELEMENT_FRAGMENT} from "../ButtonElement/fragments";
import {TEXT_ELEMENT_FRAGMENT} from "../TextElement/fragments";
import {TRIGGER_ELEMENT_FRAGMENT} from "../TriggerElement/fragments";
import {IMAGE_ELEMENT_FRAGMENT} from "../ImageElement/fragments";
import {CUSTOM_HTML_ELEMENT_FRAGMENT} from "../CustomHtmlElement/fragments";
import {FORM_ELEMENT_FRAGMENTS} from "../FormElement/fragments";
import {HOTSPOT_ELEMENT_FRAGMENT} from "../HotspotElement/fragments.js";

/**
 * Fields are needed when using a single interaction
 * in the UI
 * @type {DocumentNode}
 */
export const INTERACTION_FRAGMENT = gql`
    fragment InteractionFragment on Interaction {
        id
        timeIn
        timeOut
        element_group_id
        pause_when_shown
        show_at_video_end
        element_id
        element_type
        node_id
        send_facebook_view_event
        facebook_view_event_id
        zIndex
        element {
            ... on ButtonElement {
                ...ButtonElementFragment
            }
            ... on TextElement {
                ...TextElementFragment
            }
            ... on TriggerElement {
                ...TriggerElementFragment
            }
            ... on ImageElement {
                ...ImageElementFragment
            }
            ... on CustomHtmlElement {
                ...CustomHtmlElementFragment
            }
            ... on FormElement {
                ...FormElementFragment
            }
            ... on HotspotElement {
                ...HotspotElementFragment
            }
        }
    }
    ${BUTTON_ELEMENT_FRAGMENT}
    ${TEXT_ELEMENT_FRAGMENT}
    ${TRIGGER_ELEMENT_FRAGMENT}
    ${IMAGE_ELEMENT_FRAGMENT}
    ${CUSTOM_HTML_ELEMENT_FRAGMENT}
    ${FORM_ELEMENT_FRAGMENTS}
    ${HOTSPOT_ELEMENT_FRAGMENT}
`;