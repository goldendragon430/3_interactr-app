import { useReactiveVar } from "@apollo/client";
import cx from 'classnames';
import Icon from 'components/Icon';
import uniqueId from 'lodash/uniqueId';
import React from 'react';
import ReactTooltip from "react-tooltip";
import { getWhitelabel } from "../../graphql/LocalState/whitelabel";
import styles from './Button.module.scss';

const Button = ({
  className,
  primary,
  secondary,
  color,
  large,
  red,
  right,
  left,
  grouped,
  white,
  loading,
  noFloat,
  noMarginRight,
  greyDark,
  icon,
  rightIcon = false,
  children,
  text,
  xxs,
  small,
  disabled,
  style,
  tooltip,
  ...myProps
}) => {
  
  const whitelabel = useReactiveVar(getWhitelabel);
  const classes = cx(className, styles.Button, {
    [styles.primary]: primary,
    [styles.secondary]: secondary,
    [styles.large]: large,
    [styles.red]: red,
    [styles.right]: right,
    [styles.left]: left,
    [styles.grouped] : grouped,
    [styles.white] : white,
    [styles.greyDark] : greyDark,
    [styles.noFloat]: noFloat,
    [styles.noMarginRight]: noMarginRight,
    [styles.rightIcon] : rightIcon,
    [styles.xxs] : xxs,
    [styles.small] : small,
    [styles.disabled] : disabled,
  });

  let inlineStyles = {};

  if (whitelabel){
    //inlineStyles.backgroundImage = 'none';
    if (primary){
      inlineStyles.background =  whitelabel.primary_color;
    } else if (secondary){
      inlineStyles.background =  whitelabel.secondary_color;
    }
  }
  if(color){
    inlineStyles.background = color;
  }

  const newStyles = {...style, ...inlineStyles};

  const theIcon = (loading) ? 'spinner-third' : icon;

  const id = uniqueId();

  return (
    <button {...myProps} data-tip={tooltip} data-for={id} disabled={disabled || loading} className={classes} style={newStyles} >
      { (!!tooltip) && <ReactTooltip id={id} className="tooltip" />}
      {icon && !rightIcon && <Icon name={theIcon} spin={loading} className={styles.icon} />}
      {children || text}
      {icon && rightIcon && <Icon name={theIcon} spin={loading} className={styles.icon} />}
    </button>
  );
};

export default Button;