import React from "react";
import styles from "../ClientsPage.module.scss";
import Avatar from "./Cover/Avatar";
import Logo from "./Cover/Logo";
import Actions from "./Cover/Actions";
import {useParams} from "react-router-dom";


const ProfileCover = () => {
    let {clientId} = useParams();
    if (!clientId) return <Actions />;

    return (
        <>
            <div className={styles.header} style={{height: '200px'}}>
                <Avatar />
                <Logo />
            </div>
            <Actions />
        </>
    );
};

export default ProfileCover;