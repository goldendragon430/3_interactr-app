import { useReactiveVar } from "@apollo/client";
import Icon from 'components/Icon';
import React from 'react';
import Modal from "../../../../components/Modal";
import {
  getAddMedia,
  setAddMedia,
  SHOW_MEDIA_NAME_MODAL, SHOW_THUMBNAIL_SELECT_MODAL,
  SHOW_UPLOAD_FROM_FILE_MODAL
} from "../../../../graphql/LocalState/addMedia";
import { errorAlert } from "../../../../utils/alert";
import { AcceptedMedia } from "../../utils";
import DropMediaZone from "../DropMediaZone";
import { MEDIA_RATIOS, getMediaRatio } from "utils/mediaUtils";
import { toast } from "react-toastify";

function UploadFromFileModal({onClose, onBack, onNext}) {
  const { activeModal, droppedFiles, newMediaObject } = useReactiveVar(getAddMedia);

  if(!newMediaObject) return null;
  const { base_width, base_height } = newMediaObject;

  let dropzoneParams = {
   // projectId: newMediaObject.project_id
  };
  
  const handleNext = (isImage, src) => {
    setAddMedia({
      newMediaObject: {
        is_image: isImage,
        temp_storage_url: src,
        url: src
      },
    });
    const nextModal = (isImage) ? SHOW_MEDIA_NAME_MODAL : SHOW_THUMBNAIL_SELECT_MODAL;
    onNext(nextModal, SHOW_UPLOAD_FROM_FILE_MODAL)
  }

  const checkMediaRatio = (mediaRatio, projectRatio, isImage, src) => {
    if(projectRatio != mediaRatio) {
      toast.error("Media ratio doesn't match project ratio.", {
        position: 'top-right',
        theme:"colored"
      });
    } else {
      handleNext(isImage, src);
    }
  }

  return (
    <Modal
      onBack={onBack}
      onClose={onClose}
      height={430}
      width={600}
      closeMaskOnClick={false}
      show={activeModal===SHOW_UPLOAD_FROM_FILE_MODAL}
      heading={
        <><Icon name="cloud-upload"/>Upload File</>
      }
    >
      <div style={{ padding: 10 }}>
        {/* We add this here to ensure the dropzone delete's when this modal isn't active. This is so any errors are cleared when the user clicks back */}
        {(activeModal===SHOW_UPLOAD_FROM_FILE_MODAL &&  <DropMediaZone
          initialFiles={droppedFiles}
          onError={()=>errorAlert({text: 'Unable to upload media'})}
          onSuccess={({src}, file) => {
            const isImage = file && file.type !== 'video/mp4' ? 1 : 0;
            const projectRatio = getMediaRatio(base_width, base_height);
            if(isImage) {
              const image = document.createElement('img');
              image.src = src;
              image.addEventListener('load', () => {
                const imageRatio = getMediaRatio(image.width, image.height);
                checkMediaRatio(imageRatio, projectRatio, isImage, src);
              });
            } else {
              const video = document.createElement('video');
              video.src = src;
              video.addEventListener('loadedmetadata', () => {
                const videoRatio = getMediaRatio(video.videoWidth, video.videoHeight);
                checkMediaRatio(videoRatio, projectRatio, isImage, src);
              });
            }
          }}
          tempUpload={true}
          // uploadSuccessEndpoint={'file/upload'}
          params={dropzoneParams}
          accept={AcceptedMedia}
        />)}
        <p>
          <strong>Videos</strong><br/>
          All uploaded videos should be aspect ratio { MEDIA_RATIOS[base_width]}
        </p>
        <p>
          <strong>Images</strong><br/>
          All uploaded images should be {base_width}px * {base_height}px
        </p>
      </div>
    </Modal>
  )
}


export default UploadFromFileModal;