import React, { useEffect }  from 'react';
import { useReactiveVar } from "@apollo/client";

import getAsset from "utils/getAsset";
import { Icon, ItemSelect, Modal } from 'components'
import { setAddNode } from "@/graphql/LocalState/addNode";
import { 
  setNodeSettings,
  SHOW_CHANGE_SOURCE_MEDIA_MODAL,
} from "@/graphql/LocalState/nodeSettings";
import {
  getAddMedia,
  setAddMedia,
  SHOW_UPLOAD_FROM_FILE_MODAL, 
  SHOW_UPLOAD_FROM_LIBRARY_MODAL, 
  SHOW_UPLOAD_FROM_STOCK_MODAL, 
  SHOW_UPLOAD_FROM_URL_MODAL,
  SHOW_UPLOAD_TYPE_SELECT_MODAL
} from "@/graphql/LocalState/addMedia";

import { useParams } from 'react-router-dom';
import {useQuery} from "@apollo/client";
import {GET_PROJECT} from "@/graphql/Project/queries";
import { toast } from 'react-toastify';

/**
 * Display the allowed types of media upload
 *
 * @param setType
 * @param close
 * @param name
 * @param setName
 * @param setState
 * @returns {*}
 * @constructor
 */
const SelectUploadTypeModal = ({ onClose, onNext }) => {
  const {activeModal, addingNode, previousModals} = useReactiveVar(getAddMedia);
  const {projectId} = useParams();

  const {data, loading, error} = useQuery(GET_PROJECT, {
    fetchPolicy: 'cache-only',
    variables: { projectId }
  });

  useEffect(() => {
    if(!loading && !error && activeModal===SHOW_UPLOAD_TYPE_SELECT_MODAL) {
      const project = data.result;
      setAddMedia({
				newMediaObject: {
					base_width: project.base_width,
          base_height: project.base_height
				}
			});
    }
    if(error) {
      console.error(error);
      toast.error(error, {
        position: 'top-right',
        theme:"colored"
      });
    }
  }, [loading, error, activeModal]);

  const SelectType = (type) => {
    onNext(type, SHOW_UPLOAD_TYPE_SELECT_MODAL);
  };

  const _onClose = () => {
    if(addingNode){
      // If adding a new node we need to reopen the
      // add node workflow
      setAddNode({showBackgroundMediaSelectModal: true})
    }
    onClose();
  }

  const onBack = () => {
    // If we activated the Add Media workflow through Node Settings
    // This let's us go back to the Node Media Source modal
    if (previousModals.includes(SHOW_CHANGE_SOURCE_MEDIA_MODAL)) {
      setNodeSettings({
        activeModal: SHOW_CHANGE_SOURCE_MEDIA_MODAL
      });
    }
    _onClose()
  }

  return(
    <Modal
      height={485}
      width={1200}
      show={activeModal===SHOW_UPLOAD_TYPE_SELECT_MODAL}
      onClose={_onClose}
      onBack={onBack}
      closeMaskOnClick={false}
      heading={
        <><Icon name={'cloud-upload'} /> Please select an upload type</>
      }
    >
      <div className={'grid'}>
        <UploadType
          heading={'Upload File'}
          description={'Upload a media file from your computer'}
          image={getAsset('/img/img-upload-file.png')}
          setType={()=>SelectType(SHOW_UPLOAD_FROM_FILE_MODAL)}
        />
        <UploadType
          heading={'Upload from URL'}
          description={'Upload a media file from a web url'}
          image={getAsset('/img/img-upload-url.png')}
          setType={()=>SelectType(SHOW_UPLOAD_FROM_URL_MODAL)}
        />
        <UploadType
          heading={'Stock Media'}
          description={'Select from our collection of stock videos and images'}
          image={getAsset('/img/img-stock-video.png')}
          setType={()=>SelectType(SHOW_UPLOAD_FROM_STOCK_MODAL)}
        />
        <UploadType
          heading={'Media Library'}
          description={'Select a file previously uploaded to a different project'}
          image={getAsset('/img/img-media-library.png')}
          setType={()=>SelectType(SHOW_UPLOAD_FROM_LIBRARY_MODAL)}
        />
      </div>
    </Modal>
  )
}
export default SelectUploadTypeModal;

/**
 * List item for the upload types
 *
 * @param icon
 * @param children
 * @param setType
 * @returns {*}
 * @constructor
 */
function UploadType({image, children, setType, heading, description}){

  return(
    <div className={'col3'}>
      <ItemSelect
        heading={heading}
        description={description}
        onClick={setType}
        image={image}
      />
    </div>
  )
}