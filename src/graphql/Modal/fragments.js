import {gql} from "@apollo/client";
import {BUTTON_ELEMENT_FRAGMENT} from "../ButtonElement/fragments";
import {TEXT_ELEMENT_FRAGMENT} from "../TextElement/fragments";
import {IMAGE_ELEMENT_FRAGMENT} from "../ImageElement/fragments";
import {CUSTOM_HTML_ELEMENT_FRAGMENT} from "../CustomHtmlElement/fragments";
import {FORM_ELEMENT_FRAGMENTS} from "../FormElement/fragments";



export const MODAL_ELEMENT_FRAGMENT = gql`
    fragment ModalElementFragment on ModalElement {
        id
        element_type
        element_id
        modal_id
        element {
            ... on ButtonElement {
                ...ButtonElementFragment
            }
            ... on TextElement {
                ...TextElementFragment
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
        }
    }
    ${BUTTON_ELEMENT_FRAGMENT}
    ${TEXT_ELEMENT_FRAGMENT}
    ${IMAGE_ELEMENT_FRAGMENT}
    ${CUSTOM_HTML_ELEMENT_FRAGMENT}
    ${FORM_ELEMENT_FRAGMENTS}
`;

export const MODAL_FRAGMENT = gql`
    fragment ModalFragment on Modal {
        id
        name
        created_at
        elements {
            ...ModalElementFragment
        }
        backgroundColour
        show_close_icon
        border_radius
        size
        close_icon_color
        background_animation
        interaction_layer
        is_template
        project_id
        project {
            id
            base_width
            base_height
            font
        }
    }
    ${MODAL_ELEMENT_FRAGMENT}
`;