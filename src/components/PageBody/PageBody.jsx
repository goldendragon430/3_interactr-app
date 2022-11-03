import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Navigate, useParams } from 'react-router-dom';
import PropTypes from 'prop-types';

import HeaderRow from '../HeaderRow';

import styles from './PageBody.module.scss';

export const preAnimationState = {opacity: 0, y: '10px'};
export const animationState = {opacity: 1, y: 0};
export const transition = { type: "spring", duration: 0.3, bounce: 0.2, damping: 15};

export const PageBody = ({ children, customHeader, hasAccess,  ...props }) => {
  const {nodeId} = useParams();

  /**
   * Little hack used to prevent scrolling on the
   * node editor
   * @type {{overflow: string}}
   */
  const style = (nodeId) ? {
    overflow: 'hidden'
  } : {}

  return (
    <main className={styles.main} style={style}>
      {/* 👇 Default Header  */}
      {customHeader ? customHeader : <HeaderRow {...props} />}
      <AnimatePresence>
        <motion.section
          className={styles.main_body}
          exit={preAnimationState}
          initial={preAnimationState}
          animate={animationState}
          transition={transition}
        >
          {hasAccess ? children : <Navigate to="/" />}
        </motion.section>
      </AnimatePresence>
    </main>
  );
}

PageBody.defaultProps = {
  hasAccess : true
}

PageBody.propTypes = {
  // Custom header component, overwrites default header comopnent
  customHeader: PropTypes.node,
  heading: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  meta: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  children: PropTypes.element,
  hasAccess: PropTypes.bool.isRequired
};
