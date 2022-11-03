import {gql}  from '@apollo/client';


/**
 * Fragment for the custom element fields
 * @type {DocumentNode}
 */
export const CUSTOM_HTML_ELEMENT_FRAGMENT = gql`
    fragment CustomHtmlElementFragment on CustomHtmlElement {
        id
        posX
        posY
        width
        height
        html
        name
        zIndex
        created_at
    }
`;