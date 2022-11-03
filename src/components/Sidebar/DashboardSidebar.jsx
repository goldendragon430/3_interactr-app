import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import styles from './DashboardSidebar.module.scss';
import Icon from 'components/Icon';
// import { injectStyles } from 'utils/domUtils';
import cx from 'classnames';
import AccountAvatar from '../AccountAvatar';
import MenuItem from '../MenuItem';
import getAsset from 'utils/getAsset';
import SubUserMenu from "./SubUserMenu";
import ParentUserMenu from "./ParentUserMenu";
import { useParams } from 'react-router-dom'
import {useAuthUser} from "../../graphql/User/hooks";
import {motion} from 'framer-motion';
import {useReactiveVar} from "@apollo/client";
import {getWhitelabel} from "../../graphql/LocalState/whitelabel";
import {getAcl} from "../../graphql/LocalState/acl";

const _proptypes = {
  projects: PropTypes.array,
};

const Sidebar = () => {
  const [activeTab, setActiveTab] = useState('');

  const acl = useReactiveVar(getAcl);

  const whitelabel = useReactiveVar(getWhitelabel);

  const user = useAuthUser();

  useEffect(()=>{

    if(window.location.href.includes('dashboard')){
      setActiveTab('dashboard')
    }
    if(window.location.href.includes('/agency')){
      setActiveTab('agency')
    }
  }, [])


  // ======= Crappy and Hacky as hell way to style active tab
  // while considering whitelabel custom colors ==========
  const setClasses = tab => {
    return cx([styles.menu_item], {
      [styles.active]: tab === activeTab
      // pile classes here as per 'classnames' rules
    });
  };

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
    hidden: { opacity: 0, x: -15 },
    show: { opacity: 1, x:0, transition: {type: 'ease-in'} }
  };

  const sidebarWhitelabelStyles = {};

  if (whitelabel) {
    sidebarWhitelabelStyles.background = whitelabel.background_colour;
  }

  return (

      <aside className={styles.sidebar_wrapper} style={sidebarWhitelabelStyles}>
        <Logo whitelabel={whitelabel} />
        <AccountAvatar user={user}  />

        { (acl.isSubUser) ?
          <SubUserMenu setClasses={setClasses} list={list} item={item}  /> :
          <ParentUserMenu user={user}  setClasses={setClasses} isSuperUser={acl.isAdmin} list={list} item={item}/>
        }

      </aside>
  );

};

Sidebar.propTypes = _proptypes;
export default Sidebar;

const Logo = ({whitelabel}) => {

  const animate = {
    opacity: 1,
    bottom: 15,
  };

  const transition = { type: "spring", duration: 0.3, bounce: 0.2, damping: 15}

  return(
    <>
      {!whitelabel ? (
        <React.Fragment>
          <motion.img src={getAsset('/img/logo.png')} className={styles.sidebar_logo} animate={animate} transition={transition} />
          <motion.img src="https://s3.us-east-2.amazonaws.com/interactrapp.com/interactr-icon.png" className={styles.sidebar_logo_small} animate={animate} transition={transition} />
        </React.Fragment>
      ): (
        <>
          <motion.img src={whitelabel.logo} className={styles.sidebar_logo}  animate={animate} />
          <motion.img src={whitelabel.icon} className={styles.sidebar_logo_small}  animate={animate} />
        </>
      )}
    </>
  );
};
