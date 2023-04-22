import React, { useState, useContext } from 'react';
import Icon from "../../../../components/Icon";
import Button from "../../../../components/Buttons/Button";
import {errorAlert} from "../../../../utils/alert";
import {getUrlExtension} from "../../../../utils/helpers";
import {useReactiveVar} from "@apollo/client";
import {
    getAddMedia, setAddMedia, SHOW_MEDIA_NAME_MODAL, SHOW_THUMBNAIL_SELECT_MODAL,
    SHOW_UPLOAD_FROM_FILE_MODAL,
    SHOW_UPLOAD_FROM_URL_MODAL
} from "../../../../graphql/LocalState/addMedia";
import Modal from "../../../../components/Modal";
import {Option, TextInput} from "../../../../components/PropertyEditor";
import apis from 'utils/apis';
import { MEDIA_RATIOS, getMediaRatio } from "utils/mediaUtils";
import { toast } from 'react-toastify';

const UploadFromUrlModal = ({ onNext, onError, onClose, onBack }) => {
    const {activeModal, newMediaObject} = useReactiveVar(getAddMedia);
    const [url, setUrl] = useState('');
    const [uploading, setUploading] = useState(false);

    if(!newMediaObject) return null;
    const { base_width, base_height } = newMediaObject;

    const isValidUrl = () => {
        // check it's an https
        if (!url.startsWith('https://')) {
            errorAlert({text: 'You can only use https urls with the interactr player. Please download this image and upload to the app using the upload media from file option'});
            return null;
        }

        return true;
    };

    const isImageUrl = () => {
        const ext = getUrlExtension(url);

        switch (ext) {
            case 'jpg':
            case 'jpeg':
            case 'png':
            case 'svg':
                return 1;
            case 'mp4':
                return 0;
            default:
                throw new Error('The url file extension is incorrect');
        }
    };


    const handleNext = async (isImage, url) => {
        try {
            // need to add code for saving media to S3
            const path = await uploadFile(url);
            setUploading(false);
            setAddMedia({
                newMediaObject: {
                    is_image: isImage,
                    temp_storage_url: path,
                    // url: url
                },
            });
    
            const nextModal = (isImage) ? SHOW_MEDIA_NAME_MODAL : SHOW_THUMBNAIL_SELECT_MODAL;
            onNext(nextModal, SHOW_UPLOAD_FROM_URL_MODAL)
        } catch(e) {
            console.error(e);
            setUploading(false);
        }
    }

    const checkMediaRatio = (mediaRatio, projectRatio, isImage, url) => {
        if(projectRatio != mediaRatio) {
            toast.error("Media ratio doesn't match project ratio.", {
                position: 'top-right',
                theme:"colored"
            });
            setUploading(false);
        } else {
            handleNext(isImage, url);
        }
    }

    const handleSubmit = async () => {
        if(isValidUrl()) {
            try {
                setUploading(true);
                const isImage = isImageUrl();
                const projectRatio = getMediaRatio(base_width, base_height);
                if(isImage) {
                    const image = document.createElement('img');
                    image.src = url;
                    image.addEventListener('load', () => {
                      const imageRatio = getMediaRatio(image.width, image.height);
                      checkMediaRatio(imageRatio, projectRatio, isImage, url);
                    });
                } else {
                    const video = document.createElement('video');
                    video.src = url;
                    video.addEventListener('loadedmetadata', () => {
                        const videoRatio = getMediaRatio(video.videoWidth, video.videoHeight);
                        checkMediaRatio(videoRatio, projectRatio, isImage, url);
                    });
                }
            } catch(e) {
                console.log(e);
                setUploading(false);
            }
        }
    }

    const uploadFile = async (url) => {
        const params = {
            url: url
        };
        const res = await apis.uploadFileFromUrl(params);
        return res.filePath;
    }

    return (
        <Modal
            show={activeModal===SHOW_UPLOAD_FROM_URL_MODAL}
            onBack={()=>onBack("showUploadFromUrlModal")}
            onClose={onClose}
            height={370}
            closeMaskOnClick={false}
            width={500}
            heading={
                <><Icon name="cloud-upload"/> Upload Media from URL</>
            }
            submitButton={
                <Button
                    onClick={handleSubmit}
                    icon="cloud-upload"
                    primary
                    loading={uploading}
                >
                    Upload
                </Button>
            }
        >
            <Option
                label="Media File Url"
                placeholder="ex. https://your/video/file/source.mp4"
                value={url}
                Component={TextInput}
                onChange={val=>setUrl(val)}
                onEnter={handleSubmit}
            />
             <p>
                <strong>Videos</strong><br/>
                All uploaded videos should be aspect ratio { MEDIA_RATIOS[base_width]}
            </p>
            <p>
                <strong>Images</strong><br/>
                All uploaded images should be {base_width}px * {base_height}px
            </p>
        </Modal>
    );
};

export default UploadFromUrlModal;