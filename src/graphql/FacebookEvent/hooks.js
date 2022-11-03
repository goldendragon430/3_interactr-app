import {createMutationHook, createQueryHook} from "../utils";
import {GET_FACEBOOK_EVENT} from "./queries";
import {CREATE_FACEBOOK_EVENT, UPDATE_FACEBOOK_EVENT} from "./mutations";

export const useFacebookEvent = id => createQueryHook({
  typename:'FacebookEvent',
  query: GET_FACEBOOK_EVENT,
  variables:{id}
});

export const useCreateFacebookEvent = ( options = {} ) => createMutationHook({
  mutation: CREATE_FACEBOOK_EVENT,
});

export const useSaveFacebookEvent = (id, options = {}) => createMutationHook({
  mutation: UPDATE_FACEBOOK_EVENT,
});