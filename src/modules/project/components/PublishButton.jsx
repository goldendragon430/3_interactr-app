import React, {useState} from 'react';
import Button from 'components/Buttons/Button';
import Icon from 'components/Icon';
import {useProjectCommands, usePublishProject} from "../../../graphql/Project/hooks";
import {errorAlert, success} from "../../../utils/alert";
import {useParams} from "react-router-dom";
import {toast} from "react-toastify";



export default function PublishButton({
  text,
  size,
  color,
  children,
}) {
  const {projectId} = useParams();

  const {publishProject} = useProjectCommands();

  const [publishing, setPublishing] = useState(false);

  const handlePublish = async (e) => {
    setPublishing(true)

    try {
      await publishProject({
        variables: {
          id: projectId
        }
      });


      success("Project Published")


    }catch(err){
      console.error(err);
      errorAlert({
        title: 'Unable to Publish Project',
        text : 'An error occurred whilst trying to publish your project. Please try again. If the problem persists please contact support'
      })
    }

    setPublishing(false)
  };

  const handleDisabled = () => {
    errorAlert({
      text: 'Publishing is currently disabled in the early stage beta. Please use preview to test your project in the player'
    })
  }

  const primary = (color==='primary');

  return (
    <Button primary={primary}  icon="cloud-upload" onClick={handlePublish} loading={publishing}  >
      Publish Project
    </Button>
  );
}
