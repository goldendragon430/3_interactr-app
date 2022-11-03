import React, {useEffect} from 'react';
import {setBreadcrumbs} from "../../../../graphql/LocalState/breadcrumb";
import {dashboardPath} from "../../../dashboard/routes";
import {projectsPath} from "../../routes";
import {useProject} from "../../../../graphql/Project/hooks";
import Icon from "../../../../components/Icon";
import ErrorMessage from "../../../../components/ErrorMessage";
import moment from "moment";
import ProjectViewsChart from "../Charts/ProjectViewsChart";
import EngagementChart from "../Charts/EngagementChart";
import {AnimatePresence, motion} from "framer-motion";
import {animationState, preAnimationState, transition} from "../../../../components/PageBody";

const ProjectEngagementPage = ({startDate, endDate}) => {
  const [project, _, {loading, error}] = useProject();

  setBreadcrumbs([
    {text: 'Dashboard', link: dashboardPath()},
    {text: 'Projects', link: projectsPath()},
    {text: 'Project Engagement'},
  ]);

  if(loading) return <Icon loading />;

  if(error) return <ErrorMessage error={error} />

  return(
    <AnimatePresence>
      <motion.div
        exit={preAnimationState}
        initial={preAnimationState}
        animate={animationState}
        transition={transition}>
        <EngagementChart
          project={project}
          startDate={ startDate }
          endDate={ endDate }
        />
      </motion.div>
    </AnimatePresence>
  )
}
export default ProjectEngagementPage;