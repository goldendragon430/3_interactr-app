import React from "react";
import styles from "../../ClientsPage.module.scss";
import cx from "classnames";
import DropImageZone from "../../../../media/components/DropImageZone";
import {cache} from "../../../../../graphql/client";
import {gql} from "@apollo/client";
import {useSubUserCommands} from "../../../../../graphql/User/hooks";
import {useParams} from "react-router-dom";
import {errorAlert} from "../../../../../utils/alert";

const Logo = () => {
    let {clientId} = useParams();
    const subUser = cache.readFragment({
        id: `User:${clientId}`,
        fragment: gql`
            fragment SubUserFragment on User {
                id
                logo
            }
        `,
    });

    const {saveSubUser} = useSubUserCommands(clientId);

    const saveLogo = async (src) => {
        try {
            await saveSubUser({
                variables: { input : { id: subUser.id, logo: src}}
            });
        } catch (err) {
            errorAlert({text: 'Unable to save changes'});
            console.error(err);
        }
    };

    if (!subUser) return null;

    return (
        <>
            <div className={cx(styles.logo, 'vertical-center')}>
                <ShowLogoOrDropZone subUser={subUser} saveLogo={saveLogo} />
            </div>
            <img src={'https://s3.us-east-2.amazonaws.com/static.videosuite.io/interactr/thames-541456_1280.jpg'} className={'img-fluid'}/>
        </>
    );
};


const ShowLogoOrDropZone = ({subUser, saveLogo}) => {
    if (subUser.logo) return <img src={subUser.logo} className={'img-fluid'}/>;

    return <DropImageZone
        directory="companyLogos"
        onSuccess={image => {saveLogo(image.src)}}
        src={subUser.logo}
    />;
};

export default Logo;