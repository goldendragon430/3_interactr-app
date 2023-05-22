import { useQuery } from "@apollo/client";
import gql from "graphql-tag";
import React from 'react';
import { useParams } from "react-router-dom";
import CopyToClipboard from "../../../components/CopyToClipboard";
import ErrorMessage from "../../../components/ErrorMessage";
import MessageBox from "../../../components/MessageBox";
import { generateEmbedCode } from "../utils";
import PublishButton from "./PublishButton";
import { UnpublishButton } from "./UnpublishButton";
import ContentLoader from "react-content-loader";

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

const ProjectPublishing = () => {
  const { projectId } = useParams();

  const project = useQuery(PROJECT_QUERY, {
    variables: { projectId }
  });

  if(project.error) return <ErrorMessage error={project.error} />

  return (
    <div className={'grid'}>
      <div className={'col6'}>
        <h3 className="form-heading">Project Publishing</h3>
        {
          project.loading ? <LoadingContent /> :
          <>
            <ProjectEmbedCode project={project.data.result} />
            <PublishButton color={'primary'}/>
            {
              project.data.result.published_path && <UnpublishButton />
            }
          </>
        }
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


const ProjectEmbedCode = ({project}) => {

  if(! project.published_path){
    return <p>Publish project to generate embed code</p>
  }

  return <CopyToClipboard value={generateEmbedCode(project)} />
}

const LoadingContent = () => {
  return (
    <div className={'form-control'}>
      <ContentLoader
        speed={2}
        width="746"
        height="150"
        viewBox={`0 0 746 150`}
        backgroundColor="#f3f6fd"
      >
        {/* Only SVG shapes */}
        <rect x="0" y="0" rx="10" ry="10" width="746" height="150" />
      </ContentLoader>
    </div>
  )
}