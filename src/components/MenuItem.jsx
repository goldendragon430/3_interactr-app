import React from 'react';
import PropTypes from 'prop-types';
import Icon from 'components/Icon';
import {MenuLink} from './Link';
import Button from './Buttons/Button';
import {motion} from "framer-motion";
import styles from '../components/Sidebar/DashboardSidebar.module.scss'

const _propTypes = {
  to: PropTypes.string,
  href: PropTypes.string,
  icon : PropTypes.any,
};




const MenuItem = ({ className, icon,children, active, page, ...props }) => {
  const checkActive = (match, location) => {
    // "/projects/add/agency-club-templates-calendar"
    // output: 'projects'
    const activePageName = location.pathname.split('/')[1];
    return activePageName === page;
  };

  const myProps = {
    ...props,
    //isActive: checkActive
  };
  
  // if MenuLink is being rendered as DOM <a> element, do not set activeClassName as prop
  if (props.to) {
    myProps.activeClassName = styles.active;    
  }
  
  return (
    <MenuLink to={props.to} href={props.href}  {...myProps}>
      {icon && <Icon fixedWidth name={icon} />}
      {children}
    </MenuLink>
  );
};

MenuItem.propTypes = _propTypes;


export default MenuItem;
