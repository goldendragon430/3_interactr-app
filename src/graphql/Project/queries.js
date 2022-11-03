import {gql} from "@apollo/client";
import {PROJECT_FRAGMENT, PROJECTS_FRAGMENT, SHARE_PAGE_FRAGMENT} from "./fragments";
import {PAGINATOR_FIELDS} from "../utils";

/**
 * Query the projects list
 * @type {DocumentNode}
 */
export const GET_PROJECTS = gql`
    query projects(
        $search: String = "", 
        $first: Int = 24, 
        $page: Int = 1, 
        $project_group_id: Int = null, 
        $orderBy: String = "is_favourite",
        $sortOrder: SortOrder = DESC
    ) {
        result: projects(
            search: $search, 
            first: $first, 
            page: $page, 
            project_group_id: $project_group_id, 
            orderBy: [{column: $orderBy, order: $sortOrder}, {column: "created_at", order: DESC}]
        ) {
            data {
                ...ProjectsFragment
            }
            paginatorInfo {
                ...PaginatorFragment
            }
        }
    }
    ${PROJECTS_FRAGMENT}
    ${PAGINATOR_FIELDS}
`;

export const GET_PROJECT_TEMPLATES = gql`
    query templates(
        $title: String,
        $first: Int = 20,
        $search: String = "",
        $page: Int = 1,
        $is_template: Int = 1,
    ) {
        result: templates(
            template_name: $title,
            first: $first,
            search: $search,
            page: $page,
            is_template: $is_template,
        ) {
            data {
                id
                template_image_url
                template_name
                isAuthUserLike
                templateLikesCount
                templateNodesCount
                template_interactions
            }
            paginatorInfo {
                ...PaginatorFragment
            }
        }
    }
    ${PAGINATOR_FIELDS}
`;
export const GET_PROJECTS_BY_ID = gql`
    query projectsById($projectIds: [Int]!) {
        result: projectsById(projectIds: $projectIds) {
            ...ProjectsFragment
        }
    }
    ${PROJECTS_FRAGMENT}
`;

/**
 * Query a single project
 * @type {DocumentNode}
 */
export const GET_PROJECT = gql`
    query project($projectId: ID!) {
        result: project(id: $projectId) {
            ...ProjectFragment
        }
    }
    ${PROJECT_FRAGMENT}
`;

export const GET_SHARE_PAGE = gql`
    query sharepage($storage_path: String!) {
        result: sharepage(storage_path: $storage_path) {
            ...SharePageFragment
        }
    }
    ${SHARE_PAGE_FRAGMENT}
`;

/**
 * Query project templates by a given list of IDs
 * @type {DocumentNode}
 */
export const GET_TEMPLATES_BY_ID = gql`
    query templatesById($ids: [Int!]!) {
        result: templatesById(includeIds: $ids) {
            ...ProjectFragment
        }
    }
    ${PROJECT_FRAGMENT}
`;