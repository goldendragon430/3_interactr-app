import {gql}  from '@apollo/client';


/**
 * Fragment for the hotspot element fields
 * @type {DocumentNode}
 */
export const HOTSPOT_ELEMENT_FRAGMENT = gql`
    fragment HotspotElementFragment on HotspotElement {
        id
        created_at
        posX
        posY
        width
        height
        action
        actionArg
        open_in_new_tab
        name
        zIndex
        send_facebook_click_event
        facebook_click_event_id
        send_survey_click_event
    }
`;