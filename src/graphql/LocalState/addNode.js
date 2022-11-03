import {makeVar} from "@apollo/client";


export const ADD_NODE_VAR_INITAL_DATA = {
  showBackgroundTypeSelectModal: false,
  showBackgroundMediaSelectModal: false,
  showBackgroundColorSelectModal: false,
  showBackgroundFromProjectMediaModal: false,
  showNameSelectModal:false,
  newNodeObject:{},
  // If the node has an image or solid color background
  // we need to manually set a duration of the final step
  // to enable this just set this to true when the node
  // background is chosen
  staticNode: false,
}

export const getAddNode = makeVar(ADD_NODE_VAR_INITAL_DATA);

/**
 * Helper function to update data in the local var
 * @param newData
 */
export const setAddNode = (newData) => {
  const oldData = getAddNode();

  if(newData.newNodeObject) {
    // We want to ensure new data passed to this is merged
    // and doesn't override the whole object
    newData.newNodeObject = {...oldData.newNodeObject, ...newData.newNodeObject};
  }

  const data = {...oldData, ...newData};
  //console.log(data);
  getAddNode(data);
}