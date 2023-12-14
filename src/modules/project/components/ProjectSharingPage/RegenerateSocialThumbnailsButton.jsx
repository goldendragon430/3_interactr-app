import React from "react";
import styles from "./SharingProjectPage.module.scss";
import Button from "../../../../components/Buttons/Button";
import {useRegenerateSocialThumbnails} from "../../../../graphql/Project/hooks";

/**
 * Regenerate project social thumbnails on click to button
 * @param project
 * @returns {*}
 * @constructor
 */
const RegenerateSocialThumbnailsButton = ({project}) => {
    const [regenerateSocialThumbnails, {loading: regenerating}] = useRegenerateSocialThumbnails();
    const onRegenerate = async(project_id)=>{
       const result = await regenerateSocialThumbnails(null, parseInt(project.id))
        console.log(result)
    }
    return (
        <Button
            disabled={!project.image_url}
            secondary
            className={styles.replaceButton}
            onClick={onRegenerate}
            loading={regenerating}
            icon="redo-alt"
        >
            Regenerate
        </Button>
    );
};

export default RegenerateSocialThumbnailsButton;