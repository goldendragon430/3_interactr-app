import React, { useState } from 'react';
import Button from "../../../components/Buttons/Button";
import { useProjectCommands } from "../../../graphql/Project/hooks";
import { errorAlert, success } from "../../../utils/alert";
import { useParams } from "react-router-dom";

export const UnpublishButton = () => {
  const {unpublishProject} = useProjectCommands();
  const [unpublishing, setUnpublishing] = useState(false);
  const { projectId } = useParams();
  // If the project isn't published yet we can unpublished so hide the button
  const handleUnpublish = async () => {
    setUnpublishing(true);
    
    try {
      await unpublishProject({
        variables:{
          id: parseInt(projectId)
        }
      });

      success("Project UnPublished")


    }catch (err){
      console.error(err);
      errorAlert({text: "Unable to unpublish project"})
    }

    setUnpublishing(false)
  };

  return (
    <Button icon="cloud-download" red onClick={handleUnpublish} loading={unpublishing}>
      Unpublish Project
    </Button>
  )
};