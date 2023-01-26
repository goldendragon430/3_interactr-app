import {makeVar} from "@apollo/client";

export const ADD_IMAGE_VAR_INITIAL_DATA = {
  showImageElementModal: false,
  showUploadImageFromComputerModal: false,
  newImageElement: null,
  imageElement: null
}

export const getAddImage = makeVar(ADD_IMAGE_VAR_INITIAL_DATA);

/**
 * Helper function to update data in the local var
 * @param newData
 */
 export const setAddImage = (newData) => {
  const oldData = getAddImage();

  if(newData.newImageElement) {
    // We want to ensure new data passed to this is merged
    // and doesn't override the whole object
    newData.newImageElement = {...oldData.newImageElement, ...newData.newImageElement};
  }

  const data = {...oldData, ...newData};
  getAddImage(data);
}