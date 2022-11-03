import React from 'react';
import Icon from 'components/Icon';
import {NavLink} from 'react-router-dom';

export default function SidebarItem({
  children,
  className,
  activeClassName,
  iconClassName,
  icon,
  link
}) {
  return (
    <NavLink
      className={className}
      activeClassName={activeClassName}
      end
      to={link}
    >
      <Icon name={icon} className={iconClassName} />
      {children}
    </NavLink>
  );
}
