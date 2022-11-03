import {gql} from "@apollo/client";
import {IMAGE_ELEMENT_FRAGMENT} from "./fragments";
import {BUTTON_ELEMENT_FRAGMENT} from "../ButtonElement/fragments";

export const CREATE_IMAGE_ELEMENT = gql`  
  mutation createImageElement($input: CreateImageElementInput!) {
      result: createImageElement(input: $input) {
          ...ImageElementFragment
      }
  },
  ${IMAGE_ELEMENT_FRAGMENT}
`;

export const UPDATE_IMAGE_ELEMENT = gql`
    mutation updateImageElement($input: UpdateImageElementInput) {
        result: updateImageElement(input: $input) {
            ...ImageElementFragment
        }
    },
    ${IMAGE_ELEMENT_FRAGMENT}
`;