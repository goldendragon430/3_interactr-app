import {makeVar} from "@apollo/client";

export const ADD_MODAL_ELEMENT_VAR_INITIAL_DATA = {
  showAddElementModal: false,
  showSelectImageElementTypeModal: false,
  showAddFromImageLibraryModal: false,
  showAddImageFromComputerModal: false,
  showAddHtmlElementModal: false,
  newElement: {
    name: 'My New Element',
    element_group_id: 0,
    type: "",
    src: "",
    html: "",
    posObject: {}
  }
}

export const getAddModalElement = makeVar(ADD_MODAL_ELEMENT_VAR_INITIAL_DATA);

/**
 * Helper function to update data in the local var
 * @param newData
 */
 export const setAddModalElement = (newData) => {
  const oldData = getAddModalElement();

  if(newData.newElement) {
    // We want to ensure new data passed to this is merged
    // and doesn't override the whole object
    newData.newElement = {...oldData.newElement, ...newData.newElement};
  }

  const data = {...oldData, ...newData};
  getAddModalElement(data);
}