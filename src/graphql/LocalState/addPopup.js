import {makeVar} from "@apollo/client";

export const ADD_MODAL_VAR_INITAL_DATA = {
  showSelectPopupTypeModal: false,
  showPopupNameModal: false,
  showSelectFromProjectPopupsModal: false,
  showSelectFromPopupTemplatesModal: false,
  newModalObject: null,
  currentModalId: null,
  isPopupSelected: false,
  projectId: false
}

export const getAddModal = makeVar(ADD_MODAL_VAR_INITAL_DATA);

/**
 * Helper function to update data in the local var
 * @param newData
 */
 export const setAddModal = (newData) => {
  const oldData = getAddModal();

  if(newData.newModalObject) {
    // We want to ensure new data passed to this is merged
    // and doesn't override the whole object
    newData.newModalObject = {...oldData.newModalObject, ...newData.newModalObject};
  }

  const data = {...oldData, ...newData};
  //console.log(data);
  getAddModal(data);
}