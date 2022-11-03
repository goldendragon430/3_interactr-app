import {gql} from "@apollo/client";
import {FACEBOOK_EVENT_FRAGMENT} from "./fragment";

export const GET_FACEBOOK_EVENT = gql`
    query facebookEvent($id: ID!) {
        result: facebookEvent(id: $id) {
            ...FacebookEventFragment
        }
    }
  ${FACEBOOK_EVENT_FRAGMENT}
`;