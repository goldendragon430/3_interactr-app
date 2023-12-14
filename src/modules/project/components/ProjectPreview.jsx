import React, { useEffect } from 'react';
import { generateEmbedCodeForPreviewing } from 'modules/project/utils';
import styles from './ProjectPreview.module.scss';
import Spinner from 'components/Spinner';
import VideoPlayer from '../../../components/VideoPlayer';
import PropTypes from 'prop-types';
import Icon from "components/Icon";
import {useSetState} from "../../../utils/hooks";
import gql from "graphql-tag";
import {useQuery} from "@apollo/client";
import ErrorMessage from "../../../components/ErrorMessage";
import { importScript } from 'utils/domUtils';

const ProjectPreview = ({projectId, startNodeId, templateId,  ...props}) => {
  const [cacheBuster, setCacheBuster] = useSetState( randomNumberStr() );

  if(templateId) {
    return <PreviewTemplateProject
      cacheBuster={cacheBuster}
      projectId={templateId}
    />;
  }

  if(projectId) {
    return <PreviewUsersProject
      cacheBuster={cacheBuster}
      projectId={projectId}
      startNodeId={startNodeId}
      {...props}
    />;
  }

  return null;
};
export default ProjectPreview;

export function randomNumberStr() {
  return Math.random()
    .toString()
    .replace('.', '');
}

const TEMPLATE_QUERY = gql`
    query template($id: ID!) {
        result: template(id: $id) {
            id
            base_width
            base_height
            embed_width
            embed_height
            start_node_id
            image_url
        }
    }
`;
export const PreviewTemplateProject = ({cacheBuster, projectId}) => {
  const {data, loading, error} = useQuery(TEMPLATE_QUERY, {
    variables:{
      id: projectId
    }
  });
  const player = useQuery(PLAYER_QUERY);
  
  if(loading || player.loading) return <Icon loading />;
  
  if(player.error) return <ErrorMessage error={player.error} />
  if(error) return <ErrorMessage error={error} />;

  return <Preview
    project={data.result}
    player={player.data.result}
    cacheBuster={cacheBuster}
  />
};

const PROJECT_QUERY = gql`
    query project($id: ID!) {
        result: project(id: $id) {
            id
            base_width
            base_height
            embed_width
            embed_height
            start_node_id
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

const PreviewUsersProject = ({cacheBuster, projectId, startNodeId, ...props }) => {
  const {data, loading, error} = useQuery(PROJECT_QUERY, {
    variables:{
      id: projectId
    }
  });

  
  if(loading) return <Icon loading />;
  if(error) return <ErrorMessage error={error} />;

  return <Preview
    project={data.result}
    startNodeId={startNodeId}
    {...props}
  />
}

const Preview = React.forwardRef(({ project, startNodeId }) => {
  useEffect(() => {
    console.log( project.id, project.start_node_id,project.preview_url)
    const wrapperUrl = import.meta.env.VITE_WRAPPER_URL;    
    runPlayerWrapper(wrapperUrl);
    return () => {
      window.__ictr_wrpr_check__ = false;
    }
  }, [project]);  

  if(! project) return null;
  const html = generateEmbedCodeForPreviewing(project, startNodeId);
  
  return (
    <div className={styles.wrapper}>
      {project.start_node_id === 0 && (
        <div className="embed-responsive">
          <div className="embed-responsive-item">
            <div className={styles.noVideo}>
              <h3>Unable To Show Preview As Project Has No Start Node</h3>
            </div>
          </div>
        </div>
      )}
      {project.start_node_id > 0 && (
        <div>
          {project.preview_url ? (
            <div className="embed-responsive">
              <div className="embed-responsive-item">
                <VideoPlayer url={project.preview_url} videoId={project.id} className="embed-responsive-item" />
              </div>
            </div>
          ) :  (
            <div>
              <div dangerouslySetInnerHTML={{__html: html}}/>
            </div>
          )}
        </div>
      )}
    </div>
  );
})

/** the weird function call is a hack for re-running wrapper code
because the iframe gets injected by react.
And the wrapper code in embedded situation is expecting
to run after all player frames are loaded hence the hack
to call it whenever a new player is added to the page 
*/
function runPlayerWrapper(wrapperUrl) {
  if (window.__ictr_run_wrapper) {
    window.__ictr_run_wrapper();
  } else {    
    importScript(wrapperUrl);
  }
}