import React from "react";
import styles from "../../ClientsPage.module.scss";
import {cache} from "../../../../../graphql/client";
import {gql} from "@apollo/client";
import {avatar} from "../../../../../utils/helpers";
import {useParams} from "react-router-dom";

const Avatar = () => {
    let {clientId} = useParams();
    const subUser = cache.readFragment({
        id: `User:${clientId}`,
        fragment: gql`
            fragment SubUserFragment on User {
                id
                avatar_url
            }
        `,
    });

    return (
        <div className={styles.avatar}>
            <img src={avatar(subUser)} className={'img-fluid'} />
        </div>
    );
};

export default Avatar;