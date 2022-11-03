import React from 'react';
import {useParams} from "react-router-dom";
import {AnimatePresence, motion} from "framer-motion";
import cx from "classnames";
import styles from "../Analytics/ProjectStatsSubnav.module.scss";
import {MenuLink} from "../../../../components/Link";
import {
  projectPlayerChaptersPath, projectPlayerPath, projectPlayerPlayingStatePath, projectPlayerSharingPath,
  projectStatsEngagementPath,
  projectStatsPath,
  projectStatsViewsPath
} from "../../routes";

const PlayerSettingsSubNav = () => {
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
          <MenuLink to={projectPlayerPath({ projectId })} end={true} activeClassName={styles.active}>
            <strong>Initial State</strong><br/>
            Setup the player state when its first loaded on the page
          </MenuLink>
        </motion.li>
        <motion.li className={styles.item} variants={item}>
          <MenuLink to={projectPlayerPlayingStatePath({ projectId })}  activeClassName={styles.active}>
            <strong>Playing State</strong><br/>
            Settings for when the project is playing
          </MenuLink>
        </motion.li>
        <motion.li className={styles.item} variants={item}>
          <MenuLink to={projectPlayerSharingPath({ projectId })}  activeClassName={styles.active}>
            <strong>Sharing Settings</strong><br/>
            Configure the sharing settings for the player
          </MenuLink>
        </motion.li>
        <motion.li className={styles.item} variants={item}>
          <MenuLink to={projectPlayerChaptersPath({ projectId })}  activeClassName={styles.active}>
            <strong>Project Chapters</strong><br/>
            Enable & choose which nodes to use as chapters
          </MenuLink>
        </motion.li>
      </motion.ul>
    </AnimatePresence>
  )
};
export default PlayerSettingsSubNav;