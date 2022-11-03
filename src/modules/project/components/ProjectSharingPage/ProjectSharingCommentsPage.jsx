import React, {useEffect} from 'react'
import Icon from "../../../../components/Icon";
import {AnimatePresence, motion} from "framer-motion";
import {animationState, preAnimationState, transition} from "../../../../components/PageBody";
import {setBreadcrumbs} from "../../../../graphql/LocalState/breadcrumb";
import {dashboardPath} from "../../../dashboard/routes";
import {projectsPath} from "../../routes";
import {useQuery} from "@apollo/client";
import {GET_COMMENTS} from "../../../../graphql/Comment/queries";
import {useParams} from "react-router-dom";
import gql from "graphql-tag";
import ErrorMessage from "../../../../components/ErrorMessage";
import ContentLoader from "react-content-loader";
import Comment from "../../../../components/Comment";
import map from 'lodash/map'

const PROJECT_QUERY = gql`
    query project($projectId: ID!) {
        result: project(id: $projectId) {
            id
            likes
        }
    }
`
const ProjectSharingCommentsPage = () => {
  const {projectId} = useParams();

  const {data, loading, error} = useQuery(GET_COMMENTS, {
    variables: {
      project_id: parseInt(projectId)
    }
  });

  const {data: projectData, loading: projectLoading, error: projectError} = useQuery(PROJECT_QUERY, {
    variables: {
      projectId: parseInt(projectId)
    }
  })

  useEffect(()=>{
    setBreadcrumbs([
      {text: 'Dashboard', link: dashboardPath()},
      {text: 'Projects', link: projectsPath()},
      {text: 'Project Share Page'},
      {text: 'Likes & Comments'},
    ]);
  }, [])

  if(loading || projectLoading) {
    return(
      <ContentLoader
        speed={3}
        width={1190}
        height={875}
        viewBox={`0 0 1190 875`}
        backgroundColor="#f3f6fd"
      >
        <rect x="0" y="0" rx="3" ry="3" width={850} height={150} />
        <rect x="0" y="175" rx="3" ry="3" width={850} height={150} />
        <rect x="0" y="350" rx="3" ry="3" width={850} height={150} />
        <rect x="0" y="525" rx="3" ry="3" width={850} height={150} />
        <rect x="0" y="700" rx="3" ry="3" width={850} height={150}/>
        <rect x="0" y="875" rx="3" ry="3" width={850} height={150} />

        <rect x="950" y="0" rx="3" ry="3" width={200} height={50} />
      </ContentLoader>
    )
  }

  if(error || projectError) {
    return <ErrorMessage error={error || projectError} />
  }

  const {likes} = projectData.result;

  return (
    <AnimatePresence>
      <motion.div
        exit={preAnimationState}
        initial={preAnimationState}
        animate={animationState}
        transition={transition}
        style={{paddingLeft: '30px'}}
      >
        <section>
          <div className={'grid'}>
            <div className={'col9'}>
              <CommentWrapper comments={data.result.data}/>
            </div>
            <div className={'col1'}>&nbsp;</div>
            <div className={'col2'}>
              <div className="form-control">
                <h4 className="faded-heading" style={{ marginTop: '15px', marginBottom: '5px' }}>
                  Likes
                </h4>
                <p style={{ marginTop: 0 }}>
                  <Icon name="heart" /> {likes}
                </p>
              </div>
            </div>

          </div>
        </section>
      </motion.div>
    </AnimatePresence>
  );

}
export default ProjectSharingCommentsPage;

const CommentWrapper = ({comments}) => {
  if(! comments.length) {
    return <p><em>No Comments have been submitted on your share page yet</em></p>
  }

  return map(comments, comment => <Comment comment={comment}  />)
}