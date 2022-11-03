import React, {useState} from 'react';
import styles from "../../agency/components/AgencyAppSetup/AgencyAppSetupPage.module.scss";
import ProjectSettings from "./ProjectSettings";
import ProjectFont from "./ProjectFont";
import ProjectFolder from "./ProjectFolder";
import ProjectAudio from "./ProjectAudio";
import ProjectMediaCompressionSettings from "./ProjectMediaCompressionSettings";
import ProjectFacebookPixel from "./ProjectFacebookPixel";
import {AnimatePresence, motion} from "framer-motion";
import {animationState, preAnimationState, transition} from 'components/PageBody';


import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import ProjectPublishing from "./ProjectPublishing";
import ProjectDangerZone from "./ProjectDangerZone";
import {useNavigate, useParams} from "react-router-dom";
import {useProjectCommands} from "../../../graphql/Project/hooks";
import {confirm, errorAlert} from "../../../utils/alert";
import {projectsPath} from "../routes";


const ProjectSettingsForm = () => {
  const {projectId} = useParams();

  const {deleteProject} = useProjectCommands();

  const [deleting, setDeleting] = useState(false);

  const navigate = useNavigate();

  /**
   * We need to place the delete stuff here because the delete mutation removes the project from the cache
   * before we can redirect away from the page so all the settings components throw errors. Having the deleting
   * prop here means we can remove them components when deleting and prevent them errors
   */
  const handleDelete = () => {
    confirm({
      title: 'Are You Sure!',
      text: 'Are You Sure You Want To Delete This Project?',
      confirmButtonText: 'Yes, Delete It!',
      onConfirm: async () => {
        setDeleting(true);

        try {
          await deleteProject({
            variables: {
              id: projectId
            },
            onCompleted:()=>{
              debugger;
            }
          })

          navigate( projectsPath() )

        }catch(err){
          console.error(err);
          errorAlert({text: 'Unable to delete project'});
          setDeleting(false)
        }

        close();
      }
    });
  };

  return (
    <Page>
      {(! deleting && <>
        <ProjectSettings />
        <Divider />

        <ProjectMediaCompressionSettings />
        <Divider />

        {/*<ProjectFacebookPixel />*/}
        {/*<Divider />*/}

        <ProjectFont />
        <Divider />

        <ProjectFolder />
        <Divider />

        <ProjectPublishing />
        <Divider />
      </>)}

      {/* <ProjectAudio /> */}

      <ProjectDangerZone handleDelete={handleDelete} deleting={deleting}/>
      <Divider />
    </Page>
  );
};

export default ProjectSettingsForm;

/**
 * The base page for the component
 * @param children
 * @param parent_user_id
 * @returns {*}
 * @constructor
 */
 const Page = ({ children }) => {
  return(
    <AnimatePresence>
      <motion.div
        exit={preAnimationState}
        initial={preAnimationState}
        animate={animationState}
        transition={transition}
      >
        <div style={{ paddingLeft: '30px', paddingBottom: '150px' }}>
          {children}
        </div>
      </motion.div>
    </AnimatePresence>
  )
};

const Divider = () => {
  return <div className={styles.divider}>&nbsp;</div>
}
