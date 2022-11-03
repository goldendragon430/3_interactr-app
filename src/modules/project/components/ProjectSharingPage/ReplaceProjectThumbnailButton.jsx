import React, {useState} from "react";
import Button from "../../../../components/Buttons/Button";
import styles from "./SharingProjectPage.module.scss";

import ReplaceProjectThumbnailModal from "../ReplaceProjectThumbnail/ReplaceProjectThumbnailModal";
import SelectProjectThumbnailFromMedia from "../ReplaceProjectThumbnail/SelectProjectThumbnailFromMedia";
import {errorAlert, success} from "../../../../utils/alert";
import {useProjectCommands} from "../../../../graphql/Project/hooks";
import UploadCustomProjectThumbnail from "../ReplaceProjectThumbnail/UploadCustomProjectThumbnail";
import {useParams} from "react-router-dom";

const ReplaceProjectThumbnailButton = () => {
  const [type, setType] = useState(null);

  const [saving, setSaving] = useState(false);

  const {saveProject} = useProjectCommands();

  const {projectId} = useParams();

  const updateProjectThumbnail = async (image_url) => {
    setSaving(true);

    try {

      await saveProject({
        variables:{
          input: {
            id: parseInt(projectId),
            image_url
          }
        }
      })

      success("Project Thumbnail Updated")

      setType(null)

    }catch(err){
      console.error(err);
      errorAlert({text: 'Unable to save thumbnail'})
    }

    setSaving(false)
  };

    return (
        <>
            <Button
                secondary
                className={styles.replaceButton}
                onClick={() => setType('selectType')}
                icon="images"
            >
                Change Thumbnail
            </Button>

          <ReplaceProjectThumbnailModal
            show={type==='selectType'}
            onClose={() => setType(null)}
            setType={setType}
          />
          <UploadCustomProjectThumbnail
            show={type==='custom'}
            onClose={() => setType('selectType')}
            setType={setType}
            updateProjectThumbnail={updateProjectThumbnail}
            saving={saving}
          />
          <SelectProjectThumbnailFromMedia
            show={type==='fromMedia'}
            onClose={() => setType('selectType')}
            updateProjectThumbnail={updateProjectThumbnail}
            saving={saving}
            setType={setType}
          />
        </>
    );
};

export default ReplaceProjectThumbnailButton;