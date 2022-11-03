import {gql} from "@apollo/client";
import {COMMENT_FRAGMENT} from "./fragments";

/**
 * Create a new user item
 * @type {DocumentNode}
 */
export const CREATE_COMMENT = gql`
    mutation createComment($input: CreateCommentInput!) {
        createComment(input: $input) {
            ...CommentFragment
        }
    }
    ${COMMENT_FRAGMENT}
`;

/**
 * Delete a single comment item
 */
 export const DELETE_COMMENT = gql`
 mutation deleteComment ($id: ID!) {
     deleteComment(id: $id) {
         id
     }
 }
`;
