import {gql}  from '@apollo/client';

/**
 * Field fragment for the element groups
 * @type {DocumentNode}
 */
export const ELEMENT_GROUP_FRAGMENT = gql`
    fragment ElementGroupFragment on ElementGroup {
        id
        name
        timeOut
        timeIn
        node_id
        pause_when_shown
        show_at_video_end
        zIndex
    }
`;