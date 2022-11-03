import {gql} from "@apollo/client";
import {MEDIA_FRAGMENT} from "./fragments";
import {PAGINATOR_FIELDS} from "../utils";

export const GET_MEDIAS = gql`
    query medias(
        $search: String = "",
        $first: Int = 10,
        $page: Int = 1,
        $project_id: Int,
        $is_image: Int,
        $orderBy: String = "created_at",
        $sortOrder: SortOrder = DESC,
        $not_project_id: Int,
    ) {
        result: medias(
            search: $search,
            first: $first,
            page: $page,
            project_id: $project_id,
            is_image: $is_image,
            orderBy: [{column: $orderBy, order: $sortOrder}],
            not_project_id: $not_project_id
        ) {
            data {
                ...MediaFragment
            }
            paginatorInfo {
                ...PaginatorFragment
            }
        }
    }
    ${MEDIA_FRAGMENT}
    ${PAGINATOR_FIELDS}
`;

export const GET_MEDIA = gql`
    query media($id: ID!) {
        result: media(id: $id) {
            ...MediaFragment
        }
    }
    ${MEDIA_FRAGMENT}
`;


export const GET_BUNNY_CDN_VIDEO = gql`
    query bunnyCdnVideo($media_id: ID!) {
        result: BunnyCdnVideo(media_id: $media_id) {
            id
            status
        }
    }
`