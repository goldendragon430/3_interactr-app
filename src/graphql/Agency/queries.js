import {gql} from "@apollo/client";
import {AGENCY_FRAGMENT} from './fragments';
import {PAGINATOR_FIELDS} from "../utils";

/**
 * User query
 * @type {DocumentNode}
 */
export const GET_AGENCY = gql`
    query AgencyFirstOrCreate {
        result: agencyFirstOrCreate {
            ...AgencyFragment
        }
    }
    ${AGENCY_FRAGMENT}
`;

export const GET_WHITELABEL = gql`
    query Whitelabel($domain: String!) {
        result: whitelabel(domain: $domain) {
            ...AgencyFragment
        }
    }
    ${AGENCY_FRAGMENT}
`;

export const GET_INTERACTIVE_VIDEOS = gql`
    query interactiveVideos(
        $first: Int = 24,
        $page: Int = 1,
        $search: String = "",
    ) {
        result: interactiveVideos(
            first: $first,
            page: $page,
            search: $search
        ) {
            data {
                id
                template_image_url
                template_name
                likes
                nodesWithoutScope {
                    id
                    interactionsWithoutScope {
                        id
                    }
                }
            }
            paginatorInfo {
                ...PaginatorFragment
            }
        }
    }
    ${PAGINATOR_FIELDS}
`;

export const GET_TEMPLATE = gql`
    query template($projectId: ID!) {
        result: template(id: $projectId) {
            id
            title
            storage_path
            embed_width
            embed_height
        }
    }
`;