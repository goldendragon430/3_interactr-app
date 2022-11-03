import React from 'react';
import styles from './Label.module.scss';
import cx from "classnames";

export default class Label extends React.Component{
    render(){
        const {primary, danger, children, secondary, tooltip, flash, small, style = {}, purple} = this.props;

        const classList = cx(styles.label, {
            [styles.primary]: primary,
            [styles.secondary]: secondary,
            [styles.danger]: danger,
            [styles.flash] : flash,
            [styles.small] : small,
            [styles.purple] : purple
        });

       return  <span style={style} className={classList} data-tip={tooltip}>{children}</span>
    }
}
