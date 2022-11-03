import React from "react";
import styles from "../../ClientsPage.module.scss";
import Button from "../../../../../components/Buttons/Button";
import Icon from "../../../../../components/Icon";
import {useLoginAsUser} from "../../../../auth/utils";
import {setClientModal} from "../../../../../graphql/LocalState/clientModal";
import {useAuthUser} from "../../../../../graphql/User/hooks";
import {cache} from "../../../../../graphql/client";
import {gql} from "@apollo/client";
import {useParams} from "react-router-dom";

const Actions = () => {
    const [loginAsUser, {loading: userLoading, error}] = useLoginAsUser();
    let {clientId} = useParams();
    const authUser = useAuthUser();
    const subUser = cache.readFragment({
        id: `User:${clientId}`,
        fragment: gql`
            fragment SubUserFragment on User {
                id
                name
                email
                company_name
            } 
        `,
    });


    const onLoginAsUser = () => {
        loginAsUser({
            userId: subUser.id,
            saveOnStorage: true,
            authUser
        })
    };

    return (
        <>
            <div className={styles.header}>
                <div style={{float: 'left'}}>
                    <h2 style={{marginLeft: '225px' , marginBottom: '5px', marginTop: '15px'}}>{subUser?.company_name ?? subUser?.name}</h2>
                    <p style={{marginLeft: '225px', marginTop: 0}}>{subUser?.email}</p>
                </div>
                <div style={{float: 'right', paddingTop: '15px'}}>
                    <Button right secondary onClick={onLoginAsUser}>Login As Client <Icon loading={userLoading} name={'sign-in-alt'} /></Button>
                    <Button icon="edit" right primary onClick={() => {setClientModal({showModal: true, clientId: subUser.id})}}>
                        Edit Client
                    </Button>
                </div>
            </div>
        </>
    );
};

export default Actions;