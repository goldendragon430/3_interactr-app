import React from 'react';
import { useQuery } from "@apollo/client";
import Button from 'components/Buttons/Button';
import gql from "graphql-tag";
import first from 'lodash/first';
import ContentLoader from "react-content-loader";
import { useNavigate, useParams } from "react-router-dom";
import Icon from "../../../components/Icon";
import { setPreviewProject } from "../../../graphql/LocalState/previewProject";
import { setProjectEmbedCode } from "../../../graphql/LocalState/projectEmbedCode";
import { usePublishProject } from "../../../graphql/Project/hooks";
import { errorAlert, success, info } from "../../../utils/alert";
import { projectsPath } from "../routes";
import styles from './ProjectPage.module.scss';

/**
 * Handle the project heading
 * @param loading
 * @param project
 * @returns {JSX.Element}
 * @constructor
 */
const QUERY = gql`
    query project($projectId: ID!) {
        project(id: $projectId) {
            id
            title
        }
    }
`;
export const ProjectHeading = () => {
  const navigate = useNavigate();

  const {projectId} = useParams();

  const {data, loading, error} = useQuery(QUERY, {
    variables: {projectId}
  })

  if(loading){
    return (
      <ContentLoader
        speed={2}
        width={450}
        height={27}
        viewBox="0 0 450 27"
        foregroundColor={'#fff'}
        backgroundColor={'#f3f6fd'}
      >
        {/* Only SVG shapes */}
        <rect x="0" y="0" rx="3" ry="3" width="450" height="27" />
      </ContentLoader>
    );
  }

  const handleBack = () => {
    navigate( projectsPath() );
  };

  const title = (error || !data.project?.title) ? 'No Name' : data.project.title;

  return (
    <div className={styles.header_wrapper}>
      <h2 className={styles.header} >
        <Icon name={'chevron-square-left'} onClick={handleBack}/> {title}
      </h2>
    </div>
  );
}


/**
 * Handle the buttons that show on the top right of the project page
 * @param project
 * @param loading
 * @returns {JSX.Element|null}
 * @constructor
 */
export const ProjectButtons = () => {
    const {projectId} = useParams();

    const [updateProject, { error, loading: publishing  }] = usePublishProject(projectId);

    if (error && error.graphQLErrors.length) {
      info({
        title: 'Unable to Publish Project',
        text: first(error.graphQLErrors).debugMessage || error.message
      });
    }

    /**
     * Updates the local storage values to show the
     * preview project modal
     * @param id
     * @returns {*}
     */
    const previewProject = () => {
      window.__ictr_wrpr_check__ = false;
      setPreviewProject({
        projectId: projectId,
        templateId: false,
        startNodeId: false
      });
    }

    /**
     * Update the local storage show
     * embed code value this opens
     * the embed code modal for the
     * project
     * @param id
     */
    const showEmbedCode = ( ) => {
      setProjectEmbedCode({
        projectId
      });
    };

    const handlePublish = async () => {
      try {
        await updateProject({
          variables: {
            id: projectId
          }
        });        
        success("Project Published");
      } catch(e) {
        console.log(e);
        errorAlert({ title: 'Error', text: 'Error in publishing project'});
      }
    }

    return(
      <div style={{alignItems: 'flex-end'}}>
        <Button onClick={showEmbedCode} icon={'code'}>Embed Code</Button>
        <Button onClick={previewProject} icon={'eye'}>Preview Project</Button>
        <Button onClick={handlePublish} icon={'cloud-upload'} loading={publishing}>Publish Project</Button>
      </div>
    )
}
