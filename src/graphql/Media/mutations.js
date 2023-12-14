import { gql } from "@apollo/client";
import { MEDIA_FRAGMENT } from "./fragments";

export const CREATE_MEDIA = gql`
  mutation createMedia($input: CreateMediaInput!) {
    createMedia(input: $input) {
      ...MediaFragment
    }
  }
  ${MEDIA_FRAGMENT}
`;

/**
 * Create a single media item by uploading file
 * @type {DocumentNode}
 */
export const CREATE_MEDIA_BY_UPLOAD = gql`
  mutation createMediaByUpload($input: CreateByUploadInput!) {
    createByUpload(input: $input) {
      ...MediaFragment
    }
  }
  ${MEDIA_FRAGMENT}
`;

/**
 * Create a single media item by url
 * @type {DocumentNode}
 */
export const CREATE_MEDIA_BY_URL = gql`
  mutation createMediaByUrl($input: CreateByUrlInput!) {
    createByUrl(input: $input) {
      media {
        ...MediaFragment
      }
      qEncodeTask {
        id
        token
        status
        failed
        percent
        error_description
      }
    }
  }
  ${MEDIA_FRAGMENT}
`;

/**
 * Delete a single media item
 */
export const DELETE_MEDIA = gql`
  mutation deleteMedia($id: ID!) {
    deleteMedia(id: $id) {
      id
    }
  }
`;

/**
 * Update a single media item
 */
export const UPDATE_MEDIA = gql`
  mutation updateMedia($input: UpdateMediaInput!) {
    updateMedia(input: $input) {
      ...MediaFragment
    }
  }
  ${MEDIA_FRAGMENT}
`;
