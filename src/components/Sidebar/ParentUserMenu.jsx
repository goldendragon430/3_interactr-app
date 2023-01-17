import React, { useState, useEffect } from 'react';
import styles from './DashboardSidebar.module.scss';
import MenuItem from "../MenuItem";
import Icon from 'components/Icon';
import {motion} from 'framer-motion'
import {logout} from "@/modules/auth/utils";
import {trainingPath} from "@/modules/training/routes";
import {agencyPath} from "@/modules/agency/routes";
import {adminPath} from "@/modules/auth/routes";;
import {accountPath} from "@/modules/account/routes";
import {projectsPath} from "@/modules/project/routes";
import {videosPath} from "@/modules/media/routes";
import {useReactiveVar} from "@apollo/client";
import {getWhitelabel} from "../../graphql/LocalState/whitelabel";
import {getAcl} from "../../graphql/LocalState/acl";


const ParentUserMenu = ({setClasses, user, isSuperUser, list, item}) => {
  const [viewTraining, setViewTraining] = useState(true);
  const acl = useReactiveVar(getAcl);
  const whitelabel = useReactiveVar(getWhitelabel);
  useEffect(() => {
    if(acl.isSubUser || whitelabel) {
      setViewTraining(false);
    }
  }, [acl, whitelabel]);

  return(
    <motion.ul className={styles.menu_section}   initial="hidden" animate="show"  variants={list}>
      <motion.li variants={item} >
        <MenuItem icon="tachometer" to={'/dashboard'} page="dashboard">
          <span className={styles.menu_item_text}>Dashboard</span>
        </MenuItem>
      </motion.li>

      <motion.li  variants={item} >
        <MenuItem icon="project-diagram" to={projectsPath()} page="projects">
          <span className={styles.menu_item_text}>Projects</span>
        </MenuItem>
      </motion.li>

      <motion.li variants={item} >
        <MenuItem icon="photo-video" to={videosPath({})} page="media">
          <span className={styles.menu_item_text}>Media</span>
        </MenuItem>
      </motion.li>

      <motion.li variants={item} >
        <MenuItem icon="users-cog" to={agencyPath()} page="agency">
          <span className={styles.menu_item_text}>Agency</span>
        </MenuItem>
      </motion.li>

      {/*<motion.li className={setClasses('surveys')} variants={item} >*/}
      {/*  <MenuItem icon="tools"  to={'/surveys'}>*/}
      {/*    <span className={styles.menu_item_text}>Tools</span>*/}
      {/*  </MenuItem>*/}
      {/*</motion.li>*/}
      {
        viewTraining ? 
        <motion.li variants={item} >
          <MenuItem icon="user-graduate" to={trainingPath()} page="training">
            <span className={styles.menu_item_text}>Training</span>
          </MenuItem>
        </motion.li>
        : null
      }

      <motion.li variants={item} >
        <MenuItem icon="life-ring" onClick={()=>Beacon('open')} page="support">
          <span className={styles.menu_item_text}>Support</span>
        </MenuItem>
      </motion.li>

      <motion.li variants={item} >
        <MenuItem icon="user" to={accountPath()} page="account">
          <span className={styles.menu_item_text}>Account</span>
        </MenuItem>
      </motion.li>


      {/*<MenuItem icon="users-class" className={this.setClasses('masterclass')} to={'/masterclass'}>*/}
      {/*  <span className={styles.menu_item_text}>Masterclass</span>*/}
      {/*</MenuItem>*/}


      {/* {
          (!!isSuperUser) &&
          <motion.li  variants={item} >
            <MenuItem icon="lock"  to={adminPath()} page="admin">
              <span className={styles.menu_item_text}>Admin</span>
            </MenuItem>
          </motion.li>
      } */}

      <motion.li variants={item} >
        <a onClick={()=>logout()}>
          <Icon name="sign-out-alt"  /> <span className={styles.menu_item_text}>Logout</span>
        </a>
      </motion.li>
    </motion.ul>
  )
}

export default ParentUserMenu;