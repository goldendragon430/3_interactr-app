import React, { useEffect } from 'react';
import {AnimatePresence, motion} from "framer-motion";
import {animationState, preAnimationState, transition} from "../../../../components/PageBody";
import Button from "../../../../components/Buttons/Button";
import SharingOnPlayerTabs from "../ProjectSharingPage/SharingOnPlayerTabs";

const PlayerSharingSettings = ({project, update, updateEditingStatus}) => {

  useEffect(() => {
    updateEditingStatus()
  }, [])

  return(
    <AnimatePresence>
      <motion.div
        exit={preAnimationState}
        initial={preAnimationState}
        animate={animationState}
        transition={transition}>
        <div>
          <SharingOnPlayerTabs project={project} updateProject={update} />
        </div>
      </motion.div>
    </AnimatePresence>
  )
};
export default PlayerSharingSettings;