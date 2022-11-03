import React, {useState} from 'react';
import {useProjectCommands, useUnPublishProject} from "../../../graphql/Project/hooks";
import Button from "../../../components/Buttons/Button";
import {errorAlert, success} from "../../../utils/alert";
import {useParams} from "react-router-dom";
import gql from "graphql-tag";
import Icon from "../../../components/Icon";
import {useQuery} from "@apollo/client";
import {toast} from "react-toastify";

const QUERY = gql`
    query project($id: ID!) {
        result: project(id: $id) {
            id
            published_path
        }
    }
`;

export const UnpublishButton = () => {
  const {unpublishProject} = useProjectCommands();

  const [unpublishing, setUnpublishing] = useState(false);

  const {projectId} = useParams();

  const {data, loading, error} = useQuery(QUERY, {
    variables:{
      id: parseInt(projectId)
    }
  })

  if(loading) return <Icon loading />;

  if(error){
    console.error(error);
    return null;
  }

  const {published_path} = data.result;

  // If the project isn't published yet we can unpublished so hide the button
  if(! published_path) return null;

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