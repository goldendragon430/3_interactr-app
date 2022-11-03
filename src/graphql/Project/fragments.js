import {gql} from "@apollo/client";
import {NODE_FRAGMENT} from "../Node/fragments";

/**
 * Fields required for the list projects page (we don't need all the node -> elements stuff here)
 * @type {DocumentNode}
 */
export const PROJECTS_FRAGMENT = gql`
    fragment ProjectsFragment on Project {
        id
        title
        published_at
        is_favourite
        thumbnails
        storage_path
        project_group_id
        is_template
        player_skin
        created_at
    }
`;

/**
 * Fields required on the project pages
 * @type {DocumentNode}
 */
export const PROJECT_FRAGMENT = gql`
    fragment ProjectFragment on Project {
        id
        title
        font
        description
        audio_track_url
        image_url
        google_image_url
        facebook_image_url
        twitter_image_url
        branding_image_src
        base_height
        base_width
        start_node_id
        project_group_id
        is_favourite
        is_public
        show_more_videos_on_share_page
        allow_comments
        player_skin
        chapter_items
        enable_surveys
        share_data
        autoplay
        chapters
        embed_width
        embed_height
        allow_share
        likes
        fbPixelId
        published_at
        storage_path
        share_page_screenshot
        created_at
        video_encoding_resolution
        template_image_url
        template_name
        template_is_dfy
        template_is_example
        is_template
        template_interactions
        nodes {
            ...NodeFragment
        }
        modals {
            id
            name
        }
    }
    ${NODE_FRAGMENT}
`;

export const UPDATE_PROJECT_FRAGMENT = gql`
    fragment UpdateProjectFragment on Project {
        id
        title
        description
        fbPixelId
        branding_image_src
        base_height
        base_width
        start_node_id
        image_url
        template_image_url
        template_name
        project_group_id
        storage_path
        is_favourite
        player_skin
        chapter_items
        share_data
        autoplay
        chapters
        embed_width
        embed_height
        allow_share
        video_encoding_resolution
        enable_surveys
    }
`;

export const SHARE_PAGE_FRAGMENT = gql`
    fragment SharePageFragment on Project {
        id
        title
        description
        image_url
        allow_comments
        likes
        google_image_url
        facebook_image_url
        twitter_image_url
        published_path
        storage_path
        comments {
            id
            name
            email
            text
            created_at
        }
        show_more_videos_on_share_page
        user {
            id
            logo
            name
            company_name
        }
        otherVideos {
            id
            title
            created_at
            image_url
            published_path
        }
    }
`;

/**
 * Fields required on the project pages
 * @type {DocumentNode}
 */
export const CREATE_PROJECT_FRAGMENT = gql`
    fragment CreateProjectFragment on Project {
        id
        title
        description
        project_group_id
        published_at
        storage_path
        is_favourite
        thumbnails
    }
`;