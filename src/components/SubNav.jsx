import React from 'react';
import { injectStyles } from 'utils/domUtils';
import Icon from "./Icon";
import { MenuLink } from "./Link";
import styles from './SubNav.module.scss';

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
