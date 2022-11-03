import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { animationState, preAnimationState, transition } from '../../../../components/PageBody';
import { BooleanInput, Option } from '../../../../components/PropertyEditor';
import Button from '../../../../components/Buttons/Button';
import ProjectChaptersModal from '../ProjectChaptersModal';

const PlayerChaptersPage = ({ project, update, updateEditingStatus }) => {
  const [showChaptersPopup, setShowChaptersPopup] = useState(false);
  useEffect(() => {
    updateEditingStatus();
  }, []);

  const { chapters } = project;

  const tabAnimation = {
    animate: { y: 0, opacity: 1 },
    initial: { y: 25, opacity: 0 },
    transition: { type: 'spring', duration: 0.2, bounce: 0.5, damping: 15 },
  };

  return (
    <AnimatePresence>
      <motion.div exit={preAnimationState} initial={preAnimationState} animate={animationState} transition={transition}>
        <Option
          label="Enable Chapters"
          Component={BooleanInput}
          value={chapters}
          onChange={(val) => update('chapters', val)}
        />
        {!!chapters && (
          <AnimatePresence>
            <motion.div {...tabAnimation}>
              <Button primary icon={'cogs'} onClick={() => setShowChaptersPopup(true)}>
                Configure Chapters
              </Button>
            </motion.div>
          </AnimatePresence>
        )}
        <ProjectChaptersModal
          show={showChaptersPopup}
          project={project}
          updateProject={update}
          onClose={() => setShowChaptersPopup(false)}
        />
      </motion.div>
    </AnimatePresence>
  );
};
export default PlayerChaptersPage;
