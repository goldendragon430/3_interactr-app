import {gql} from "@apollo/client";
import { USER_NOTIFICATION_FRAGMENT } from "./fragments";

/**
 * Update the user notification item mutation
 * @type {DocumentNode}
 */
export const UPDATE_USER_NOTIFICATION = gql`
    mutation updateUserNotification($input: UpdateUserNotificationInput!) {
      updateUserNotification(input: $input) {
            ...UserNotificationFragment
        }
    }
    ${USER_NOTIFICATION_FRAGMENT}
`;

/**
 * Create a new user notification item
 * @type {DocumentNode}
 */
 export const CREATE_USER_NOTIFICATION = gql`
 mutation createUserNotification($input: CreateUserNotificationInput!) {
  createUserNotification(input: $input) {
         ...UserNotificationFragment
     }
 }
 ${USER_NOTIFICATION_FRAGMENT}
`;

export const DELETE_USER_NOTIFICATION = gql`
    mutation deleteUserNotification ($id: ID!) {
      deleteUserNotification(id: $id) {
            id
        }
    }
`;