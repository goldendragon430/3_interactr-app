import React, { useState } from 'react';
import Button from 'components/Buttons/Button';
import {setAddNode} from "../../../graphql/LocalState/addNode";
import {useParams} from "react-router-dom";


function AddNodeButton(){
  const {projectId} = useParams();

  const openAddNodeModal = () => {
    setAddNode({
      showBackgroundTypeSelectModal: true,
      newNodeObject: {
        project_id: parseInt(projectId),
        posX: 5,
        posY: 5
      }
    })
  }

  return(
    <React.Fragment>
      <Button primary icon="plus" onClick={openAddNodeModal}>Add Node</Button>
    </React.Fragment>
  );
}

export default AddNodeButton;