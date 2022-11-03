import React from 'react';
import TrainingVideo from 'modules/training/components/TrainingVideo';
import {setBreadcrumbs} from "../../../graphql/LocalState/breadcrumb";
import {AnimatePresence, motion} from "framer-motion";
import {animationState, preAnimationState, transition} from "../../../components/PageBody";
import {setPageHeader} from "../../../graphql/LocalState/pageHeading";
import {trainingPath} from "../routes";
import PropTypes from 'prop-types';

const meta = (
  <>
    <strong>Submitting a Support Ticket</strong>
    <p>
      You can submit a support request by going to Support Desk using the link on the top right of this page.<br />
      If you prefer to email us directly you can send an email to  {' '}
      <a href="mailto:support@videosuite.io" target="_blank" style={{ color: '#ffc180' }}>
          support@videosuite.io
      </a>
    </p>
  </>
);

const TrainingPage = ({videos, breadcrumbText}) => {
  setBreadcrumbs([
    {text: 'Training', link: trainingPath()},
    {text: breadcrumbText},
  ]);

  setPageHeader(breadcrumbText + ' Videos')

  return (
    <AnimatePresence>
      <motion.div
        exit={preAnimationState}
        initial={preAnimationState}
        animate={animationState}
        transition={transition}
      >
        {videos.map(video => (
          <TrainingVideo video={video} key={video.name} />
        ))}
      </motion.div>
    </AnimatePresence>
  );
};

TrainingPage.propTypes = {
  videos: PropTypes.array,
  breadcrumbText: PropTypes.string.isRequired
}

export default TrainingPage;