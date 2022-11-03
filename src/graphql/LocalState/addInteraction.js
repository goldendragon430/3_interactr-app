import {makeVar} from "@apollo/client";

export const ADD_INTERACTION_VAR_INITIAL_DATA = {
  showSelectElementGroupModal: false,
  showSelectImageElementTypeModal: false,
  showAddFromImageLibraryModal: false,
  showAddImageFromComputerModal: false,
  showAddHtmlElementModal: false,
  showAddElementModal: false,
  newElement: {
    name: 'My New Element',
    element_group_id: 0,
    type: "",
    src: "",
    html: "",
    posObject: {}
  }
}

export const getAddInteraction = makeVar(ADD_INTERACTION_VAR_INITIAL_DATA);

/**
 * Helper function to update data in the local var
 * @param newData
 */
 export const setAddInteraction = (newData) => {
  const oldData = getAddInteraction();

  if(newData.newElement) {
    // We want to ensure new data passed to this is merged
    // and doesn't override the whole object
    newData.newElement = {...oldData.newElement, ...newData.newElement};
  }

  const data = {...oldData, ...newData};
  getAddInteraction(data);
}