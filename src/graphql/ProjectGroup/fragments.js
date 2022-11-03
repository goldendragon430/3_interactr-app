import {gql} from "@apollo/client";

/**
 * Fragment for fields needed when listing the resource
 * @type {DocumentNode}
 */
export const PROJECT_GROUP_FRAGMENT  = gql`
    fragment ProjectGroupFragment on ProjectGroup {
        id
        title
        sort_order
        projects_count
        projectIds
    }
`;