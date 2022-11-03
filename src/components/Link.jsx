import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import cx from 'classnames';

const _proptypes = {
  /** For link internal to the app */
  /** For external links */
  href: PropTypes.string,
  to: PropTypes.string,
  isNavLink: PropTypes.bool
};
const BaseLink = ({ className, href, to, isNavLink, activeClassName,  ...props }) => {
  if (href && to) console.warn('Please provide either `href` or `to` prop to the BaseLink component, not both!');

  const Component = to ? (isNavLink ? NavLink : Link) : 'a';

  return (
    <Component
      href={href}
      to={to}
      className={({isActive}) => cx('link', {nav_link: isNavLink,  [`${activeClassName}`]: isActive, [`${className}`]: className})}
      target={href ? '_blank' : ''}
      {...props}
    >
      {props.children}
    </Component>
  );
};

BaseLink.propTypes = _proptypes;
export default BaseLink;

export const MenuLink = (props) => {
  return <BaseLink isNavLink {...props} />
}