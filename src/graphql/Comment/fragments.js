import {gql} from "@apollo/client";

export const COMMENT_FRAGMENT = gql`
    fragment CommentFragment on Comment  {
        id
        name
        email
        text
        image
        created_at
    }
`;