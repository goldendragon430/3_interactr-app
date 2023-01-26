import React from 'react';
import { useReactiveVar } from "@apollo/client";
import { RenderImageElementModal } from "./ImageElementModal";
import UploadImageFromComputerModal from "./UploadImageFromComputerModal";
import { ADD_IMAGE_VAR_INITIAL_DATA, getAddImage, setAddImage } from "../../../../graphql/LocalState/addImage";

const SelectImageElementModal = () => {
  const { showImageElementModal, showUploadImageFromComputerModal, imageElement } = useReactiveVar(getAddImage);
  
  if(!imageElement) return null;

  const onClose = () => {
    setAddImage({
      ...ADD_IMAGE_VAR_INITIAL_DATA,
      showImageElementModal: false,
      showUploadImageFromComputerModal: false,
      newImageElement: null,
      imageElement: null
    });
  }
  
  return (
    <>
      {
        showImageElementModal && 
        <RenderImageElementModal
          showStockList={showImageElementModal}
          element={imageElement}
          close={onClose}
          />
        }
      {
        showUploadImageFromComputerModal && 
        <UploadImageFromComputerModal
          show={showUploadImageFromComputerModal}
          element={imageElement}
          close={onClose}
          />
        }
    </>
  );
}

export default SelectImageElementModal;