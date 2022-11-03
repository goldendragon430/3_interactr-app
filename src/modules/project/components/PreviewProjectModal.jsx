import React from 'react';
import {useReactiveVar} from "@apollo/client";
import {getPreviewProject, setPreviewProject} from "../../../graphql/LocalState/previewProject";
import ProjectPreview from "./ProjectPreview";
import Modal from "components/Modal";
import Icon from "../../../components/Icon";
import Button from "../../../components/Buttons/Button";

const PreviewProjectModal = () => {
  const {projectId, startNodeId, templateId} = useReactiveVar(getPreviewProject);

  const closePreview = () => setPreviewProject({
    projectId: false,
    projectTemplate: false,
    startNodeId: false
  })
  
  return (
    <Modal 
      width={750} 
      height={590} 
      show={(projectId || templateId) ? true : false } 
      onClose={closePreview}
      heading={<><Icon name="eye" />Preview Project</>}
    >
      <ProjectPreview
        projectId={ parseInt(projectId) }
        startNodeId={ parseInt(startNodeId) }
        // reloader={showModal}
        templateId={ parseInt(templateId) }
      />
    </Modal>
  )
};
export default PreviewProjectModal;
