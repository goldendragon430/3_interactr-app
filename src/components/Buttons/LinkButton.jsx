import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Button.module.scss';
import cx from 'classnames';
import Icon from 'components/Icon';
import {useReactiveVar} from "@apollo/client";
import {getWhitelabel} from "../../graphql/LocalState/whitelabel";

const LinkButton = ({
                      primary,
                      secondary,
                      large,
                      children,
                      icon,
                      image,
                      xxs,
                      small,
                      noMarginRight,
                      style,
                      right,
                      ...myProps
                    }) => {

  // Just show plain loader until we can confirm whitelabel status
  const whitelabel = useReactiveVar(getWhitelabel);;

  const classes = cx(styles.Button, {
    [styles.primary]: primary,
    [styles.secondary]: secondary,
    [styles.large]: large,
    [styles.withImage]: image,
    [styles.xxs]: xxs,
    [styles.small]: small,
    [styles.noMarginRight]: noMarginRight,
    [styles.right]: right,
  });

  let inlineStyles = {};

  if (whitelabel) {
    //inlineStyles.backgroundImage = 'none';
    if (primary) {
      inlineStyles.background = whitelabel.primary_color;
    } else if (secondary) {
      inlineStyles.background = whitelabel.secondary_color;
    }
  }

  const newStyles = { ...style, ...inlineStyles };

  if (myProps.href && !myProps.to) {
    return (
      <a {...myProps} className={classes} style={newStyles}>
        {icon && <Icon name={icon} className={styles.icon} />}
        {image && <img src={image} />}
        {children}
      </a>
    );
  }

  return (
    <Link {...myProps} className={classes} style={newStyles}>
      {icon && <Icon name={icon} className={styles.icon} />}
      {image && <img src={image} />}
      {children}
    </Link>
  );
};
export default LinkButton;
