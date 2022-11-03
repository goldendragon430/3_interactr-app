import React from 'react';
import AddNodeBackgroundTypeModal from "./AddNodeBackgroundTypeModal";
import AddNodeBackgroundColorModal from "./AddNodeBackgroundColorModal";
import AddNodeBackgroundMediaModal from "./AddNodeBackgroundMediaModal";
import AddNodeNameModal from "./AddNodeNameModal";
import {ADD_NODE_VAR_INITAL_DATA, setAddNode} from "../../../../graphql/LocalState/addNode";
import AddNodeBackgroundFromProjectMediaModal from "./AddNodeBackgroundFromProjectMediaModal";

const AddNodeModals = ({ project }) => {

  const onClose = () => {
    setAddNode(ADD_NODE_VAR_INITAL_DATA);
  }

  return(
    <>
      <AddNodeBackgroundTypeModal onClose={onClose} />
      <AddNodeBackgroundColorModal onClose={onClose} />
      <AddNodeBackgroundMediaModal onClose={onClose} />
      <AddNodeBackgroundFromProjectMediaModal onClose={onClose} />
      <AddNodeNameModal onClose={onClose} project={project} />
    </>
  )
};
export default AddNodeModals;
