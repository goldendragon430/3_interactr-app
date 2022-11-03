import styles from "../ClientsPage.module.scss";
import Icon from "../../../../components/Icon";
import React from "react";
import {setClientModal} from "../../../../graphql/LocalState/clientModal";
import Button from "../../../../components/Buttons/Button";

const NoProjects = ({userId}) => {
    return (
        <div className={styles.noProjectWrapperSearch}>

            <Button icon="plus"  primary onClick={() => {setClientModal({showModal: true, userId})}}>
                Assign Projects
            </Button>
        </div>
    );
};

export default NoProjects;