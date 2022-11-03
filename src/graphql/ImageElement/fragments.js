import {gql}  from '@apollo/client';

/**
 * Fragment for the image element fields
 * @type {DocumentNode}
 */
export const IMAGE_ELEMENT_FRAGMENT = gql`
    fragment ImageElementFragment on ImageElement {
        id
        created_at
        posY
        posX
        width
        height
        src
        action
        actionArg
        open_in_new_tab
        name
        zIndex
        opacity
        animation
        send_facebook_click_event
        facebook_click_event_id
        send_survey_click_event
    }
`;