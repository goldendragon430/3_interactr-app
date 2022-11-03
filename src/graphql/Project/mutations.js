import {gql} from "@apollo/client";
import {CREATE_PROJECT_FRAGMENT, PROJECT_FRAGMENT, PROJECTS_FRAGMENT, UPDATE_PROJECT_FRAGMENT} from "./fragments";

/**
 * Create a blank project
 * @type {DocumentNode}
 */
export const CREATE_BLANK_PROJECT = gql`
    mutation createBlankProject($input: CreateBlankProjectInput!) {
        createBlankProject(input: $input) {
            ...CreateProjectFragment
        }
    }
    ${CREATE_PROJECT_FRAGMENT}
`;

/**
 * Create a template project
 * @type {DocumentNode}
 */
export const CREATE_TEMPLATE_PROJECT = gql`
    mutation createTemplateProject($input: CreateTemplateProjectInput!) {
        createTemplateProject(input: $input) {
            ...CreateProjectFragment
        }
    }
    ${CREATE_PROJECT_FRAGMENT}
`;

/**
 * Update a project
 * @type {DocumentNode}
 */
export const UPDATE_PROJECT = gql`
    mutation updateProject($input: UpdateProjectInput!) {
        updateProject(input: $input) {
            ...UpdateProjectFragment
        }
    }
    ${UPDATE_PROJECT_FRAGMENT}
`;

/**
 * Delete a project
 * @type {DocumentNode}
 */
export const DELETE_PROJECT = gql`
    mutation deleteProject ($id: ID!) {
        deleteProject(id: $id) {
            id
        }
    }
`
/**
 * Copy a project
 * @type {DocumentNode}
 */
export const COPY_PROJECT = gql`
    mutation copyProject($input: CopyProjectInput!) {
        copyProject(input: $input) {
            ...ProjectFragment
        }
    }
    ${PROJECT_FRAGMENT}
`


export const PUBLISH_PROJECT = gql`
    mutation publishProject($id: ID!) {
        publishProject(id: $id) {
            id
            published_at
            storage_path
            published_path
        }
    }
`;

export const UNPUBLISH_PROJECT = gql`
    mutation unpublishProject($id: ID!) {
        unpublishProject(id: $id) {
            id
            published_at
            storage_path
            published_path
        }
    }
`

/**
 * Regenerate project social thumbnails
 * @type {DocumentNode}
 */
export const REGENERATE_SOCIAL_THUMBNAILS = gql`
    mutation regenerateSocialThumbnails($id: ID!) {
        regenerateSocialThumbnails(id: $id) {
            projectId
            google_image_url
            facebook_image_url
            twitter_image_url
        }
    }
`;
/**
 * Like template
 * @type {DocumentNode}
 */
export const LIKE_TEMPLATE = gql`
    mutation likeTemplate($input: LikeTemplateInput!) {
        likeTemplate (input: $input) {
            id
            templateLikesCount
            isAuthUserLike
        }
    }
`;