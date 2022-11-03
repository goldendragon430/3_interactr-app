import React from 'react';
import styles from './ChildMenu.module.scss';
import {NavLink} from 'react-router-dom';

export default function ChildMenu({items}) {
  if (!items.length) return null;

  return (
    <div className={styles.menu}>
      {items.map(item => {
        return (
          <NavLink
            key={item.title}
            to={item.route}
            end
            activeStyle={{borderTopColor: 'white', color: 'white'}}
          >
            {item.title}
          </NavLink>
        );
      })}
    </div>
  );
}
