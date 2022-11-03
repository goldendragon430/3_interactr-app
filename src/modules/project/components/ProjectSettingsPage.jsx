import React, {useEffect} from 'react';
import styles from './ProjectSettingsPage.module.scss';
// import ProjectPreview from './ProjectPreview';
import ProjectSettingsForm from './ProjectSettingsForm';

// import Notification from 'components/Notification';
import Link from 'components/Link'
import {AnimatePresence, motion} from "framer-motion";
import {animationState, preAnimationState, transition} from "../../../components/PageBody";
import {setBreadcrumbs} from "../../../graphql/LocalState/breadcrumb";
import {useProject} from "../../../graphql/Project/hooks";
import {dashboardPath} from "../../dashboard/routes";
import {projectsPath} from "../routes";


const ProjectSettingsPage = () => {
  setBreadcrumbs([
    {text: 'Dashboard', link: dashboardPath()},
    {text: 'Projects', link: projectsPath()},
    {text: 'Project Settings'},
  ]);

  return(
    <AnimatePresence>
      <motion.div
        exit={preAnimationState}
        initial={preAnimationState}
        animate={animationState}
        transition={transition}
        style={{paddingLeft: '30px'}}
      >
        <section className={styles.settings_wrapper}>
          <ProjectSettingsForm className={styles.settings_form} />
        </section>
      </motion.div>
    </AnimatePresence>
  )
}
export default ProjectSettingsPage;