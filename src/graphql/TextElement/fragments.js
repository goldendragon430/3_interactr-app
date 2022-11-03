import {gql}  from '@apollo/client';

/**
 * Fragment for the text element fields
 * @type {DocumentNode}
 */
export const TEXT_ELEMENT_FRAGMENT = gql`
    fragment TextElementFragment on TextElement {
        id
        created_at
        posX
        posY
        width
        height
        html
        name
        default_values
        borderRadius
        backgroundColour
        padding
        zIndex
        letterSpacing
        borderWidth
        borderColor
        borderType
        dynamic
        animation
    }
`;