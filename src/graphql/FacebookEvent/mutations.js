import {gql} from "@apollo/client";
import {FACEBOOK_EVENT_FRAGMENT} from "./fragment";

export const CREATE_FACEBOOK_EVENT = gql`
    mutation createFacebookEvent($input: CreateFacebookEventInput!) {
        createFacebookEvent(input: $input){
            ...FacebookEventFragment
        }
    }
    ${FACEBOOK_EVENT_FRAGMENT}
`;

export const UPDATE_FACEBOOK_EVENT = gql`
    mutation updateFacebookEvent($input: UpdateFacebookEventInput!){
        updateFacebookEvent(input: $input) {
            ...FacebookEventFragment
        }
    },
    ${FACEBOOK_EVENT_FRAGMENT}
`;