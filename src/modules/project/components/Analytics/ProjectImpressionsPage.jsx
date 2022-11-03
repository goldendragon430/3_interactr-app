import React, {useEffect} from 'react';
import {useProject} from "../../../../graphql/Project/hooks";
import Icon from "../../../../components/Icon";
import ErrorMessage from "../../../../components/ErrorMessage";
import ImpressionsChart from "../Charts/ImpressionsChart";
import moment from "moment";
import {setBreadcrumbs} from "../../../../graphql/LocalState/breadcrumb";
import {dashboardPath} from "../../../dashboard/routes";
import {projectsPath} from "../../routes";
import {AnimatePresence, motion} from 'framer-motion';
import {animationState, preAnimationState, transition} from "../../../../components/PageBody";

const ProjectImpressionsPage = ({startDate, endDate}) => {
  const [project, _, {loading, error}] = useProject();

  setBreadcrumbs([
    {text: 'Dashboard', link: dashboardPath()},
    {text: 'Projects', link: projectsPath()},
    {text: 'Project Impressions'},
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
        <ImpressionsChart
          project={project}
          startDate={ startDate }
          endDate={endDate}
        />
      </motion.div>
    </AnimatePresence>

  )
}
export default ProjectImpressionsPage;