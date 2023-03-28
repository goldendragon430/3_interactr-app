import Button from 'components/Buttons/Button';
import React, { useState } from 'react';
import { useParams } from "react-router-dom";
import { useProjectCommands } from "../../../graphql/Project/hooks";
import { errorAlert, success, info } from "../../../utils/alert";
import first from 'lodash/first';

export default function PublishButton({
  text,
  size,
  color,
  children,
}) {
  const { projectId } = useParams();

  const { publishProject } = useProjectCommands();

  const [ publishing, setPublishing ] = useState(false);

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
      info({
        title: 'Unable to Publish Project',
        text : first(err.graphQLErrors).debugMessage || err.message
      })
    }

    setPublishing(false)
  };

  const primary = (color==='primary');

  return (
    <Button primary={primary}  icon="cloud-upload" onClick={handlePublish} loading={publishing}  >
      Publish Project
    </Button>
  );
}
