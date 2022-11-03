import React, {useState, useEffect} from 'react';
import Modal from 'components/Modal';
import DropFileZone from "../DropFileZone";
import Button from "../../../../components/Buttons/Button";
import Icon from "../../../../components/Icon";
import {useCreateMediaByUpload} from "../../../../graphql/Media/hooks";
import {addItem} from "../../../../graphql/utils";
import {GET_MEDIAS} from "../../../../graphql/Media/queries";
import {useMediaLibraryRoute} from "../../routeHooks";
import {errorAlert} from "../../../../utils/alert";
import ReactDOM from "react-dom";


const DropMediaUploadModal = ({ files, onClose, projectId }) => {
    const [stillLoading, setStillLoading] = useState(false);
    const [{page}] = useMediaLibraryRoute();
    const options = {
        update(cache, {data: {createByUpload: media}}) {
            const queryVars = {
                page,
                first: 12,
                is_image: parseInt(media.is_image),
                project_id: parseInt(media.project_id)
            };

            try {
                addItem(cache, GET_MEDIAS, media, 'data', queryVars);
            } catch (e) {}
        }
    };
    const [createMediaByUpload, {loading, error}] = useCreateMediaByUpload(options);
    const [droppedFiles, setDroppedFiles] = useState(Array.from(files));

    const handleUploadFile = async ({ src }, file) => {
        const isImage = file.type !== 'video/mp4' ? 1 : 0;
        setStillLoading(true);
        const name = file.name.replace(/\.[^.$]+$/, '');

        try {
            await createMediaByUpload({
                name,
                isImage,
                s3FilePath: src,
                projectId: parseInt(projectId)
            });
            setDroppedFiles(null);
            setStillLoading(false);
            onClose();
        } catch (error) {
            errorAlert({text: error});
        }
    };

    return (
        <Modal 
            show={true} 
            onClose={onClose} 
            height={300} 
            width={400}
            heading={
                <>
                    <Icon name="cloud-upload" />
                    Upload New Media
                </>
            }
            submitButton={
                (stillLoading) ? <p style={{float: 'right', marginBottom: 0, marginTop: "9px"}} >Uploading&nbsp;&nbsp;<Icon loading /></p> : null
            }
        >   
            <DropFileZone
                initialFiles={droppedFiles}
                directory="media"
                uploadSuccessEndpoint={'file/upload'}
                onSuccess={handleUploadFile}
                canRestart={false}
            />
        </Modal>
    );
};

const Portal = (props) => {
    const el = document.createElement('div');

    useEffect(()=>{
        const container = document.getElementById('modalsRoot');
        container.appendChild(el);

        return () => {
            container.removeChild(el);
        }
    }, []);

    return ReactDOM.createPortal(
        <DropMediaUploadModal {...props} />,
        el
    );
};

export default Portal;