import React from 'react';
import styles from './Button.module.scss';
import cx from 'classnames';
import Icon from 'components/Icon';
import ReactTooltip from 'react-tooltip';

// Icon Only Buttons Automatically Turns The Children Into A ToolTip
export default function IconButton(props) {
  const {primary, secondary, large, red, icon, transparent,grouped,white, iconOnly, buttonStyles, onClick,  ...myProps} = props;
  let {children} = props;

  const classes = cx(styles.Button, {
    [styles.primary]: props.primary,
    [styles.secondary]: props.secondary,
    [styles.large]: props.large,
    [styles.small]: props.small,
    [styles.transparent]: props.transparent,
    [styles.grouped] : grouped,
    [styles.white] : white,
    [styles.red]: red,
  });

  if (! children) {
    children = '';
  }

  const id = Math.random() * 100 + '_' + icon;

  return (
    <button  className={classes} data-tip={children} data-for={id} onClick={onClick} style={buttonStyles}>
      <ReactTooltip id={id} />
      <Icon name={icon} className={styles.icon} style={{marginRight: '0'}} {...myProps} />
    </button>
  );
}
