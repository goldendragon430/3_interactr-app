import React, { useState, useEffect } from 'react';
import styles from './MediaItemMenu.module.scss';
import Icon from 'components/Icon';
import cx from 'classnames';
//import onClickOutside from "react-onclickoutside";

export default function MediaItemMenu ({showMenu, openEditModal, openReplaceModal, deleteMediaItem}) {
    return (
        <div className={cx(styles.wrapper, { [styles.open] : showMenu })}>
            <div className={styles.arrow} />
            <ul className={styles.menu}>
                <li onClick={openEditModal}><Icon name="pen-square"/> Rename</li>
                <li onClick={openReplaceModal}><Icon name="pen-square"/> Replace</li>
                <li onClick={deleteMediaItem}><Icon name="trash-alt" /> Delete</li>
            </ul>
        </div>
    )
};


