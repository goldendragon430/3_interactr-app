import {gql} from "@apollo/client";
import {COMMENT_FRAGMENT} from "./fragments";
import {PAGINATOR_FIELDS} from "../utils";

export const GET_COMMENTS = gql`
    query Comments (
        $project_id: Int!,
        $first: Int = 25,
        $page: Int = 1,
    ) {
        result: comments (project_id: $project_id, first: $first, page: $page) {
            data {
                ...CommentFragment
            }
            paginatorInfo {
                ...PaginatorFragment
            }
        }
    }
    ${COMMENT_FRAGMENT}
    ${PAGINATOR_FIELDS}
`;