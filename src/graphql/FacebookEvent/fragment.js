import {gql} from "@apollo/client";

export const FACEBOOK_EVENT_FRAGMENT = gql`
    fragment FacebookEventFragment on FacebookEvent {
        id
        event_type
        event_name
        meta_data
    }
`;