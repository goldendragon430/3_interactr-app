import React, {useState} from 'react';
import {setBreadcrumbs} from "../../../../graphql/LocalState/breadcrumb";
import {setPageHeader} from "../../../../graphql/LocalState/pageHeading";
import {AnimatePresence, motion} from "framer-motion";
import {animationState, preAnimationState, transition} from "../../../../components/PageBody";
import Icon from "../../../../components/Icon";
import styles from '../ClientsPage.module.scss';
import cx from 'classnames'
import map from 'lodash/map';
import {useQuery} from "@apollo/client";
import {GET_PROJECTS_BY_ID} from "../../../../graphql/Project/queries";
import ProjectsLoading from "../../../project/components/ProjectsLoading";
import ProjectCard from "../../../project/components/ProjectCard";
import LinkButton from "../../../../components/Buttons/LinkButton";
import {addProjectPath} from "../../../project/routes";
import PageBody from "./PageBody"; 
import {GET_SUBUSER} from "../../../../graphql/User/queries";
import ErrorMessage from "../../../../components/ErrorMessage";
import {useAuthUser} from "../../../../graphql/User/hooks";
import {useParams} from "react-router-dom";
const ClientsPage = () => {
  // Used to disable the form on saving state

  setBreadcrumbs([
    {text: 'Agency', link: '/agency/dashboard'},
    {text: 'Clients'},
  ]);

  setPageHeader('Manage Your Clients');

  return (
    <AnimatePresence>
      <motion.div
        exit={preAnimationState}
        initial={preAnimationState}
        animate={animationState}
        transition={transition}
      >
        <div style={{ padding: '0px 30px' }}>
          <PageBody />
        </div>
      </motion.div>
    </AnimatePresence>
  )
};

export default ClientsPage;
