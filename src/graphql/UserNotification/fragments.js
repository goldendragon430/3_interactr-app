import {gql} from "@apollo/client";

export const USER_NOTIFICATION_FRAGMENT = gql`
    fragment UserNotificationFragment on UserNotification {
        id
        title
        details
        launch_date
        modal_height
        updated_at
        created_at
    }
`;