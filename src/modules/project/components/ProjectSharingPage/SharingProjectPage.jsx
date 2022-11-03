import React, { useEffect, useState } from 'react';
import {setBreadcrumbs} from "../../../../graphql/LocalState/breadcrumb";
import {dashboardPath} from "../../../dashboard/routes";
import {projectSharingCommentsPath, projectSharingPage, projectSharingShareDataPath, projectsPath} from "../../routes";
import {AnimatePresence, motion} from "framer-motion";
import {animationState, preAnimationState, transition} from "../../../../components/PageBody";
import {toRoutePath} from "../../../../routeBuilders";
import ProjectSharingSetupPage from "./ProjectSharingSetupPage";
import {Link, Route, Routes, useParams} from "react-router-dom";
import ProjectSharingShareDataPage from "./ProjectSharingShareDataPage";
import ProjectSharingCommentsPage from "./ProjectSharingCommentsPage";
import styles from './SharingPageSubNav.module.scss';
import Icon from "../../../../components/Icon";
import {MenuLink} from "../../../../components/Link";
import {errorAlert} from "../../../../utils/alert";
import {useSaveProject} from "../../../../graphql/Project/hooks";


/**
 * Sharing project page
 * @returns {*}
 * @constructor
 */
const SharingProjectPage = () => {
  return (
    <AnimatePresence>
      <motion.div
        exit={preAnimationState}
        initial={preAnimationState}
        animate={animationState}
        transition={transition}
      >
      </motion.div>
      <div className={'grid'}>
        <div className={'col2'}>
          <SharingPageSubNav/>
        </div>
        <div className={'col10'}>
          <PageBody/>
        </div>
      </div>
    </AnimatePresence>
  )
}

const SharingPageSubNav = () => {
  const {projectId} = useParams();

  return(
    <div className={styles.wrapper}>
      <ul>
        <li>
          <MenuLink to={projectSharingPage({ projectId })} end={true} activeClassName={styles.active}>
            <Icon name={'cog'} /> Page Setup
          </MenuLink>
        </li>
        <li>
          <MenuLink to={projectSharingShareDataPath({ projectId })} activeClassName={styles.active}>
            <Icon name={'share-alt'} /> Sharing Page
          </MenuLink>
        </li>
        <li>
          <MenuLink to={projectSharingCommentsPath({ projectId })} activeClassName={styles.active}>
            <Icon name={'comment'} /> Likes & Comments
          </MenuLink>
        </li>
      </ul>
    </div>
  )
};

const PageBody = () => {
  return (
    <Routes>
      <Route
        path='/share-data'
        element={<ProjectSharingShareDataPage />}
      />
      <Route
        path='/likes-comments'
        element={<ProjectSharingCommentsPage  />}
      />
      <Route
        index
        element={<ProjectSharingSetupPage  />}
      />
    </Routes>
  )
};

export default SharingProjectPage;
