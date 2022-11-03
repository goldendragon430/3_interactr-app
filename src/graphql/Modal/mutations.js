import {gql} from "@apollo/client";
import {MODAL_ELEMENT_FRAGMENT, MODAL_FRAGMENT} from "./fragments";

export const DELETE_MODAL_ELEMENT = gql`
    mutation deleteModalElement($id: ID!) {
        deleteModalElement(id: $id) {
            id
        }
    }
`;

export const UPDATE_MODAL_ELEMENT = gql`
    mutation updateModalElement($input: UpdateModalElementInput!) {
        updateModalElement(input: $input) {
            ...ModalElementFragment
        }
    }
    ${MODAL_ELEMENT_FRAGMENT}
`;

export const UPDATE_MODAL = gql`
    mutation updateModal($input: UpdateModalInput!) {
        result: updateModal(input: $input) {
            ...ModalFragment
        }
    }
    ${MODAL_FRAGMENT}
`;

export const CREATE_MODAL_ELEMENT = gql`
    mutation createModalElement($input: CreateModalElementInput!) {
        result: createModalElement(input: $input) {
            ...ModalElementFragment
        }
    }
    ${MODAL_ELEMENT_FRAGMENT}
`;

export const COPY_MODAL_ELEMENT = gql`
    mutation copyModalElement($input: CopyModalElementInput!) {
        result: copyModalElement(input: $input) {
            ...ModalElementFragment
        }
    }
    ${MODAL_ELEMENT_FRAGMENT}
`;

export const COPY_MODAL= gql`
    mutation copyModal($input: CopyModalInput!) {
        result: copyModal(input: $input) {
            ...ModalFragment
        }
    }
    ${MODAL_FRAGMENT}
`

export const CREATE_MODAL = gql`
    mutation createModal($input: CreateModalInput!) {
        result: createModal(input: $input){
            ...ModalFragment
        }
    }
    ${MODAL_FRAGMENT}
`

export const APPLY_TEMPLATE = gql`
    mutation applyTemplate($input: ApplyTemplateInput!){
        result: applyTemplate(input: $input) {
            ...ModalFragment
        }
    }
    ${MODAL_FRAGMENT}
`

export const DELETE_MODAL = gql`
    mutation deleteModal($id: ID!){
        deleteModal(id: $id) {
            id
        }
    }
`