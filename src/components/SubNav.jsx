import React from 'react';
import styles from './SubNav.module.scss';
import cx from 'classnames';
import { injectStyles } from 'utils/domUtils';
import {useNavigate} from "react-router-dom";
import Icon from "./Icon";
import {useProjectGroupRoute} from "../modules/project/routeHooks";
import {MenuLink} from "./Link";

const SubNav = ({items}) => {

    return (
      <ul style={{padding: 0, margin: 0}}>
        {/*{isWhitelabel ? setWhiteLabelCss(whitelabel) : null}*/}
        {items.map( (item, index) => (
          (! item.locked && <li className={styles.item} key={'subnav_'+index}>
            <MenuLink key={'subnav_'+index} {...item} activeClassName={styles.active}>
              {(!!item.icon) && <Icon name={item.icon} />}
              {item.text}
            </MenuLink>
          </li>)
        ))}
      </ul>
    );
};


// saving this in case needed for later
const setWhiteLabelCss = ({whitelabel}) => {
    if(! whitelabel) return null;

    const _css = `
                .sn_whitelabel.sn_active button {
                    color: ${whitelabel.primary_color};
                }
                .sn_whitelabel button:hover  {
                    color: ${whitelabel.primary_color};
                    // filter : brightness(.9);
                    opacity: 0.9;
                }
                
            `;

    injectStyles('whitelabel_sn', _css)
};

export default SubNav;
