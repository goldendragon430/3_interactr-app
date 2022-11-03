import React, {useEffect} from 'react';
import ImpressionsChart from "../Charts/ImpressionsChart";
import {useProject} from "../../../../graphql/Project/hooks";
import ErrorMessage from "../../../../components/ErrorMessage";
import Icon from "../../../../components/Icon";
import moment from "moment";
import {setBreadcrumbs} from "../../../../graphql/LocalState/breadcrumb";
import {dashboardPath} from "../../../dashboard/routes";
import {projectsPath} from "../../routes";
import ProjectViewsChart from "../Charts/ProjectViewsChart";
import {AnimatePresence, motion} from "framer-motion";
import {animationState, preAnimationState, transition} from "../../../../components/PageBody";

const ProjectViewsPage = ({startDate, endDate}) => {
  const [project, _, {loading, error}] = useProject();

  setBreadcrumbs([
    {text: 'Dashboard', link: dashboardPath()},
    {text: 'Projects', link: projectsPath()},
    {text: 'Project Views'},
  ]);

  if(loading) return <Icon loading />;

  if(error) return <ErrorMessage error={error} />

  return (
    <AnimatePresence>
      <motion.div
        exit={preAnimationState}
        initial={preAnimationState}
        animate={animationState}
        transition={transition}>
        <ProjectViewsChart
          project={project}
          startDate={startDate}
          endDate={endDate}
        />
      </motion.div>
    </AnimatePresence>
  )
}
export default ProjectViewsPage;