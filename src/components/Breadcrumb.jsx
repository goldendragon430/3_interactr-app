import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Breadcrumb.module.scss';
import Icon from './Icon';
import map from 'lodash/map';
import size from 'lodash/size';
import {getBreadcrumbs} from "../graphql/LocalState/breadcrumb";
import {useReactiveVar} from "@apollo/client";
import {dashboardPath} from "../modules/dashboard/routes";

/**
 * Get and list earlier stored breadcrumbs
 * @returns {*}
 * @constructor
 */
const Breadcrumb = () => {
  const crumbs = useReactiveVar(getBreadcrumbs);

  const crumbsCount = size(crumbs);
  const lastIndex = crumbsCount > 0 ? crumbsCount - 1 : 0;

  return (
      <ul className={styles.wrapper}>
        <li>
          <Link to={dashboardPath()}><Icon name={'home'} style={{marginRight: 0}}/></Link>
          {/*<Icon icon="angle-right" size="sm" className={styles.icon} />*/}
        </li>
        <span className={styles.icon}>/</span>
          {map(crumbs, (crumb, index) => {
              return (
                  <React.Fragment key={'breadcrumb_item_' + index}>
                      {/*{index > 0 && <Icon icon="angle-right" size="sm" className={styles.icon} />}*/}
                      {index > 0 && <span className={styles.icon}>/</span>}
                      <li>
                          {lastIndex === index ? (
                              <span>{crumb.text}</span>
                          ) : (
                              <Link to={crumb.link}>{crumb.text}</Link>
                          )}

                      </li>
                  </React.Fragment>
              )
          })}
      </ul>
  )
};

export default Breadcrumb;