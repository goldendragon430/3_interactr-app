import React from 'react';
import gql from "graphql-tag";
import {useParams} from 'react-router-dom';
import {useReactiveVar, useQuery} from "@apollo/client";
import {RenderImageElementModal} from "./ImageElementModal";
import UploadImageFromComputerModal from "./UploadImageFromComputerModal";
import { ADD_IMAGE_VAR_INITIAL_DATA, getAddImage, setAddImage } from "../../../../graphql/LocalState/addImage";
import {INTERACTION_FRAGMENT} from "../../../../graphql/Interaction/fragments";

const QUERY = gql`
    query interaction($id: ID!) {
        interaction(id: $id) {
            ...InteractionFragment
        }
    }
    ${INTERACTION_FRAGMENT}
`;

const SelectImageElementModal = () => {
  const {interactionId} = useParams();
  
  if(!interactionId) return null;

  return <SelectImageElementModalBody interactionId={interactionId} />
}

export default SelectImageElementModal;

const SelectImageElementModalBody = ({ interactionId }) => {
  const {data, loading, error} = useQuery(QUERY, {variables: {
    id: interactionId
  }});
  const {showImageElementModal, showUploadImageFromComputerModal} = useReactiveVar(getAddImage);

  if(loading) return null;

  if(error) return null;

  const element = data && data.interaction && data.interaction.element;

  if(!element) return null;

  const onClose = () => {
    setAddImage({
      ...ADD_IMAGE_VAR_INITIAL_DATA,
      showImageElementModal: false,
      showUploadImageFromComputerModal: false,
      newImageElement: null
    });
  }

  return (
    <>
      {
        showImageElementModal && 
        <RenderImageElementModal
          showStockList={showImageElementModal}
          element={element}
          close={onClose}
        />
      }
      {
        showUploadImageFromComputerModal && 
        <UploadImageFromComputerModal
          show={showUploadImageFromComputerModal}
          element={element}
          close={onClose}
        />
      }
    </>
  );
}