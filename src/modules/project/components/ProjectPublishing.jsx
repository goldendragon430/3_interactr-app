import React from 'react';
import MessageBox from "../../../components/MessageBox";
import {useParams} from "react-router-dom";
import gql from "graphql-tag";
import {useQuery} from "@apollo/client";
import Icon from "../../../components/Icon";
import ErrorMessage from "../../../components/ErrorMessage";
import CopyToClipboard from "../../../components/CopyToClipboard";
import {generateEmbedCode} from "../utils";
import PublishButton from "./PublishButton";
import {UnpublishButton} from "./UnpublishButton";

const ProjectPublishing = () => {
  const {projectId} = useParams();

  return (
    <div className={'grid'}>
      <div className={'col6'}>
        <h3 className="form-heading">Project Publishing</h3>
        <ProjectEmbedCode projectId={projectId} />
        <PublishButton color={'primary'}/>
        <UnpublishButton />
      </div>
      <div className={'col5'}>
        <MessageBox>
          <h3>Project Publishing</h3>
          <p>
            Give your project a title and a description. This information will be used in the app and also when you share the project on social media.
          </p>
        </MessageBox>
      </div>
    </div>
  )
}

export default ProjectPublishing;

const PROJECT_QUERY = gql`
    query project($projectId: ID!) {
        result: project(id: $projectId) {
            id
            title
            storage_path
            embed_width
            embed_height
            published_path
            image_url
        }
    }
`;

const PLAYER_QUERY = gql`
    query playerVersion {
        result: playerVersion {
            id,
            version_id
        }
    }
`;

const ProjectEmbedCode = ({projectId}) => {
  const project = useQuery(PROJECT_QUERY, {
    variables: {projectId}
  });

  const player = useQuery(PLAYER_QUERY);

  if(project.loading || player.loading) return <Icon loading />;

  if(project.error) return <ErrorMessage error={project.error} />
  if(player.error) return <ErrorMessage error={player.error} />

  if(! project.data.result.published_path){
    return <p>Publish project to generate embed code</p>
  }

  return <CopyToClipboard value={generateEmbedCode(project.data.result, player.data.result)} />
}