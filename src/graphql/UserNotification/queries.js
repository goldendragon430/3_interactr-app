import {gql} from "@apollo/client";
import {USER_NOTIFICATION_FRAGMENT} from './fragments';
import {PAGINATOR_FIELDS} from "../utils";
/**
 * Users query
 * @type {DocumentNode}
 */
 export const ALL_USER_NOTIFICATIONS = gql`
 query allUserNotifications (
     $limit: Int!, 
 ) {
     result: allUserNotifications (limit: $limit) {
         data {
             ...UserNotificationFragment
         }
         paginatorInfo {
             ...PaginatorFragment
         }
     }
 }
 ${USER_NOTIFICATION_FRAGMENT}
 ${PAGINATOR_FIELDS}
`;