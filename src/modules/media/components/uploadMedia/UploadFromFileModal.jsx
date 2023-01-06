import React, { useState } from 'react';
import DropMediaZone from "../DropMediaZone";
import Icon from 'components/Icon';
import {useReactiveVar} from "@apollo/client";
import {
  getAddMedia,
  setAddMedia,
  SHOW_MEDIA_NAME_MODAL, SHOW_THUMBNAIL_SELECT_MODAL,
  SHOW_UPLOAD_FROM_FILE_MODAL
} from "../../../../graphql/LocalState/addMedia";
import Modal from "../../../../components/Modal";
import {AcceptedMedia} from "../../utils";
import {errorAlert} from "../../../../utils/alert";

function UploadFromFileModal({onClose, onBack, onNext}) {
  const {activeModal, droppedFiles} = useReactiveVar(getAddMedia);

  let dropzoneParams = {
   // projectId: newMediaObject.project_id
  };
  
  return (
    <Modal
      onBack={onBack}
      onClose={onClose}
      height={430}
      width={600}
      closeMaskOnClick={false}
      show={activeModal===SHOW_UPLOAD_FROM_FILE_MODAL}
      heading={
        <><Icon name="cloud-upload"/> Upload File</>
      }
    >
      <div style={{ padding: 10 }}>
        {/* We add this here to ensure the dropzone delete's when this modal isn't active. This is so any errors are cleared when the user clicks back */}
        {(activeModal===SHOW_UPLOAD_FROM_FILE_MODAL &&  <DropMediaZone
          // initialFiles={droppedFiles}
          onError={()=>errorAlert({text: 'Unable to upload media'})}
          onSuccess={({src}, file) => {
            const isImage = file && file.type !== 'video/mp4' ? 1 : 0;
            
            setAddMedia({
              newMediaObject: {
                is_image: isImage,
                temp_storage_url: src,
                url: src
              },
            });

            const nextModal = (isImage) ? SHOW_MEDIA_NAME_MODAL : SHOW_THUMBNAIL_SELECT_MODAL;

            onNext(nextModal, SHOW_UPLOAD_FROM_FILE_MODAL)
          }}
          tempUpload={true}
          uploadSuccessEndpoint={'file/upload'}
          params={dropzoneParams}
          accept={AcceptedMedia}
        />)}
        <p>
          <strong>Videos</strong><br/>
          All uploaded videos should be aspect ratio 16:9, 4:3 and 9:16
        </p>
        <p>
          <strong>Images</strong><br/>
          All uploaded images should be 720px * 405px, 540px * 405px and 228px * 405px
        </p>
      </div>
    </Modal>
  )
}


export default UploadFromFileModal;