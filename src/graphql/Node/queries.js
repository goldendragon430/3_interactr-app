import {gql} from "@apollo/client";
import {NODE_FRAGMENT} from "./fragments";

export const GET_NODE = gql`
    query node($nodeId: ID!) {
        result: node(id: $nodeId) {
            ...NodeFragment
        }
    }
    ${NODE_FRAGMENT}
`;

export const GET_SURVEY_NODES = gql`
    query surveyNodes($projectId: Int!) {
        result: surveyNodes(project_id: $projectId) {
            id
            name
            interactions {
                id 
                element {
                    ... on ButtonElement {
                        id
                        name
                        send_survey_click_event
                    }
                    ... on HotspotElement {
                        id
                        name
                        send_survey_click_event
                    }
                    ... on ImageElement {
                        id
                        name
                        send_survey_click_event
                    }
                }
            }
        }
    }
`;