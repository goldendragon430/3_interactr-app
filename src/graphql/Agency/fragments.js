import {gql} from "@apollo/client";

/**
 * Field fragment for the agency
 * @type {DocumentNode}
 */
export const AGENCY_FRAGMENT = gql`
    fragment AgencyFragment on Agency {
        id
        name
        domain 
        domain_verified
        page_title
        primary_color
        secondary_color
        background_colour
        icon
        logo
    }
`;

export const AGENCY_LANDING_PAGE_FRAGMENT = gql`
    fragment AgencyLandingPageFragment on AgencyClubLandingPage {
        id
        name
        convertri_url
        clickfunnels_url
        html_url
        preview_url
        image_url
    }
`

export const AGENCY_CLUB_CONTENT_PAGE_FRAGMENT = gql`
    fragment AgencyClubContentFragment on AgencyClubDfyContent {
        id
        niche
        image_url
        projects
        landing_pages
    }
`
