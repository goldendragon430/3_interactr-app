import React from 'react'
import {useReactiveVar} from "@apollo/client";
import {getAddNode, setAddNode} from "../../../../graphql/LocalState/addNode";
import Modal from "../../../../components/Modal";
import Icon from "../../../../components/Icon";
import Button from "../../../../components/Buttons/Button";
import ItemSelect from "../../../../components/ItemSelect";
import getAsset from "../../../../utils/getAsset";
import {setAddMedia, SHOW_UPLOAD_TYPE_SELECT_MODAL} from "../../../../graphql/LocalState/addMedia";
import {useParams} from "react-router-dom";

const AddNodeBackgroundMediaModal = ({onClose}) => {
  const {showBackgroundMediaSelectModal, newNodeObject} = useReactiveVar(getAddNode);

  const {projectId} = useParams();

  const goBack = () => {
    setAddNode({
      showBackgroundTypeSelectModal: true,
      showBackgroundMediaSelectModal: false
    })
  };

  const selectProjectMedia = () => {
    setAddNode({
      showBackgroundMediaSelectModal: false,
      showBackgroundFromProjectMediaModal: true
    })
  };

  const addNewMediaToProject = () => {
    setAddNode({
      showBackgroundMediaSelectModal: false
    });

    setAddMedia({
      activeModal: SHOW_UPLOAD_TYPE_SELECT_MODAL,
      newMediaObject: {
        project_id: parseInt(projectId)
      },
      addingNode: true
    });
  }

  return(
    <Modal
      height={485}
      width={550}
      show={showBackgroundMediaSelectModal}
      closeMaskOnClick={false}
      onClose={onClose}
      onBack={goBack}
      heading={
        <><Icon name={'photo-video'} /> Choose the node background media</>
      }
    >
      <div className={'grid'}>
        <div className={'col6'}>
          <ItemSelect
            heading={"Project Media"}
            description={"Select media already uploaded to this project"}
            onClick={selectProjectMedia}
            image={getAsset('/img/img-node-bg-type-project-media.png')}
          />
        </div>
        <div className={'col6'}>
          <ItemSelect
            heading={"New Media"}
            description={"Add new media to this project"}
            onClick={addNewMediaToProject}
            image={getAsset('/img/img-node-bg-type-new-media.png')}
          />
        </div>
      </div>
    </Modal>
  )
};
export default AddNodeBackgroundMediaModal;