import {gql} from "@apollo/client";
import {MODAL_ELEMENT_FRAGMENT, MODAL_FRAGMENT} from "./fragments";

export const GET_MODAL = gql`
    query Modal ($id: ID!) {
        result: modal(id: $id) {
            ...ModalFragment
        }
    }
  ${MODAL_FRAGMENT}
`;

export const GET_MODAL_ELEMENT = gql`
    query ModalElement($id: ID!) {
        result: modalElement(id: $id) {
            ...ModalElementFragment
        }
    }
    ${MODAL_ELEMENT_FRAGMENT}
`;

export const GET_MODALS = gql`
    query modals($project_id: Int!) {
        result: modals(project_id: $project_id) {
            ...ModalFragment
        }
    }
    ${MODAL_FRAGMENT}
`;