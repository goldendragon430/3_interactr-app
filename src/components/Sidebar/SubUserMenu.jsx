import React from 'react';
import styles from './DashboardSidebar.module.scss';
import MenuItem from "../MenuItem";
import Icon from 'components/Icon';
import {motion} from "framer-motion";
import {logout} from "../../modules/auth/utils";

const SubUserMenu = ({setClasses, list, item}) => {
    return (
        <motion.ul className={styles.menu_section}   initial="hidden" animate="show"  variants={list}>
            <motion.li variants={item} >
                <MenuItem icon="project-diagram" className={setClasses('projects')} to={'/projects'}>
                    <span className={styles.menu_item_text}>Projects</span>
                </MenuItem>
            </motion.li>

            <motion.li  variants={item} >
                <MenuItem icon="photo-video" className={setClasses('videos')} to={'/media?filterBy=all&page=1&q=&orderBy=created_at&sortOrder=DESC&project_id=0&activeTab=all'}>
                    <span className={styles.menu_item_text}>Media Library</span>
                </MenuItem>
            </motion.li>

            <motion.li  variants={item} >
                <MenuItem icon="user" className={setClasses('account')} to={'/account'}>
                    <span className={styles.menu_item_text}>My Account</span>
                </MenuItem>
            </motion.li>

            <motion.li variants={item} >
                <a onClick={()=>logout()}>
                    <Icon name="sign-out-alt"  /> <span className={styles.menu_item_text}>Logout</span>
                </a>
            </motion.li>
        </motion.ul>
    )
}

export default SubUserMenu;