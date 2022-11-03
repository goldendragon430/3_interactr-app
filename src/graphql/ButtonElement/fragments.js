import {gql}  from '@apollo/client';


/**
 * Fragment for the button element
 * @type {DocumentNode}
 */
export const BUTTON_ELEMENT_FRAGMENT = gql`
    fragment ButtonElementFragment on ButtonElement {
        id
        html
        posX
        posY
        width
        height
        background
        borderRadius
        borderWidth
        borderColor
        borderType
        action
        actionArg
        open_in_new_tab
        name
        zIndex
        letterSpacing
        animation
        send_facebook_click_event
        facebook_click_event_id
        send_survey_click_event
        created_at
    }
`;


