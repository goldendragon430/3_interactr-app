import React from 'react'
import cx from "classnames";
import styles from "./RatioSelect.module.scss"
import getAsset from "utils/getAsset";

export const RatioSelect = ({heading, onClick, image, selected, value }) => {
    if(! image) image = getAsset('/img/avatar-logo.png');
	return (
		<div 
            className={cx(styles.ratioSelect, "clearfix", {[styles.selected] : selected})}
            onClick={() => onClick(value)}
        >
			<img className={styles.iconImage} src={image}/>
			<div>{heading}</div>
		</div>
	)
}