import {NavLink, useParams} from "react-router-dom";
import {
  projectStatsEngagementPath,
  projectStatsImpressionsPath,
  projectStatsPath,
  projectStatsViewsPath
} from "../../routes";
import React from "react";
import {MenuLink} from "../../../../components/Link";
import styles from "./ProjectStatsSubnav.module.scss";
import cx from 'classnames'
import {AnimatePresence, motion} from "framer-motion";

const ProjectStatsSubNav = () => {
  const {projectId} = useParams();

  const list =  {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const item = {
    hidden: { opacity: 0, x: -5, scale: 0.7 },
    show: { opacity: 1, x:0, scale: 1, transition: {type: 'ease-in'} }
  }

  return (
    <AnimatePresence>
      <motion.ul className={cx(styles.wrapper, 'clearfix')}  initial="hidden" animate="show"  variants={list}>
        <motion.li className={styles.item} variants={item}>
          <MenuLink to={projectStatsPath({ projectId })} end={true} activeClassName={styles.active}>
            <strong>Project Impressions</strong><br/>
            Each time the project is loaded on a page this counts as an impression.
          </MenuLink>
        </motion.li>
        <motion.li className={styles.item} variants={item}>
          <MenuLink to={projectStatsViewsPath({ projectId })}  activeClassName={styles.active}>
            <strong>Project Views</strong><br/>
            Counted Each time the project is played or unmuted if autoplay is on.
          </MenuLink>
        </motion.li>
        <motion.li className={styles.item} variants={item}>
          <MenuLink to={projectStatsEngagementPath({ projectId })}  activeClassName={styles.active}>
            <strong>Project Engagement</strong><br/>
            Optimize your interactive video by studying the viewer engagement.
          </MenuLink>
        </motion.li>
      </motion.ul>
    </AnimatePresence>
  )
};
export default ProjectStatsSubNav;