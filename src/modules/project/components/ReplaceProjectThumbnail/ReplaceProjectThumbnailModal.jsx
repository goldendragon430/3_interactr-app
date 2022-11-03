import React, {useState} from 'react';
import Icon from "../../../../components/Icon";
import ItemSelect from "../../../../components/ItemSelect";
import getAsset from "../../../../utils/getAsset";
import Modal from "../../../../components/Modal";

const ReplaceProjectThumbnailModal  = ({show, onClose, setType}) => {
  return (
    <Modal
      height={475}
      width={700}
      show={show}
      onClose={onClose}
      closeMaskOnClick={false}
      heading={
        <><Icon name={'cloud-upload'} /> Please select a thumbnail type</>
      }
    >
      <div className={'grid'}>
        <div className={'col6'}>
          <ItemSelect
            heading={"Select From Media"}
            description={"Select a thumbnail from your previously uploaded media"}
            onClick={()=>setType('fromMedia')}
            image={getAsset('/img/img-thumbnail-from-media.jpg')}
          />
        </div>
        <div className={'col6'}>
          <ItemSelect
            heading={"Upload Custom Thumbnail"}
            description={"Upload a custom thumbnail for this project"}
            onClick={()=>setType('custom')}
            image={getAsset('/img/img-thumbnail-custom.jpg')}
          />
        </div>
      </div>
    </Modal>
  )
};
export default ReplaceProjectThumbnailModal;