import { UPDATE_USER_NOTIFICATION, CREATE_USER_NOTIFICATION, DELETE_USER_NOTIFICATION } from "./mutations";
import { ALL_USER_NOTIFICATIONS } from "./queries";
import { addItem, createMutationHook, deleteItem } from "../utils";
import { useMutation } from "@apollo/client";
import mapValues from "lodash/mapValues";
import { cache } from "../client";
import gql from "graphql-tag";


const QUERY = gql`
    query allUserNotifications {
        result: allUserNotifications(limit: 5) {
            id
            title
            details
            launch_date
            modal_height,
            created_at
        }
    }
`;



export const useSaveUserNotification = (options = {}) => createMutationHook({
  mutation: UPDATE_USER_NOTIFICATION,
  options
});

export const useUserNotificationCommands = (id = null) => {
  const [saveUserNotification] = useMutation(UPDATE_USER_NOTIFICATION, {
    update: (cache, {data: { userNotification }}) => {
      }
  });
  
  const [createUserNotification] = useMutation(CREATE_USER_NOTIFICATION,
    {
      update: (cache, {data: { createUserNotification }}) => {
        cache.modify({
          fields: { allUserNotifications: (prevUserNotifications = []) => {
            const newUserNotification = cache.writeFragment({
              data: createUserNotification,
              fragment: gql`
                fragment NewUserNotification on UserNotification {
                  id
                  title
                  details
                  launch_date
                  modal_height
                }
              `
            });
            return [...prevUserNotifications, newUserNotification];
          } }
        });
      }
    }
  );

  const [deleteUserNotification] = useMutation(DELETE_USER_NOTIFICATION, {
    update(cache) {
      cache.modify({
        fields: {
          allUserNotifications(_, { DELETE }) {
            return DELETE;
          },
        }
      });
    }
  });

  const updateUserNotification = (key, value) => {
    const fields = (typeof key === 'object') ?
      mapValues(key, (k)=>{
          return ()=>{ return k }
      })
      : {[key]: ()=>{return value}}

    cache.modify({
        fields
    });
  };

  return {
    createUserNotification,
    deleteUserNotification,
    saveUserNotification, 
    updateUserNotification,
  }
};