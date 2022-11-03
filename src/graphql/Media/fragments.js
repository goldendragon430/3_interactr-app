import {gql}  from '@apollo/client';

export const MEDIA_FRAGMENT = gql`  
  fragment MediaFragment on Media {
      id
      name
      url
      temp_storage_url
      thumbnail_url
      is_image
      project_id
      created_at
      encoded_size
      manifest_url
  }
`;