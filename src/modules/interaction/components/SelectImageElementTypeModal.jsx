import React from 'react';
import Modal from "../../../components/Modal";
import Icon from "../../../components/Icon";
import getAsset from "../../../utils/getAsset";
import ItemSelect from "../../../components/ItemSelect";


const SelectImageElementTypeModal = ({ close, show, onBack, setTypeFromLibrary, setTypeFromComputer }) => {

  return (
    <Modal
      height={465}
      width={630}
      show={show}
      onClose={close}
      onBack={onBack}
      closeMaskOnClick={false}
      heading={
        <><Icon name={'plus'} />New Element Wizard</>
      }
    >
      <div className={'grid'}>
        <UploadType
          heading={'Image Library'}
          description={'Upload a stock image from image library'}
          image={getAsset('/img/avatar-logo.png')}
          setType={setTypeFromLibrary}
        />
        <UploadType
          heading={'Upload File'}
          description={'Upload an image file from your computer'}
          image={getAsset('/img/avatar-logo.png')}
          setType={setTypeFromComputer}
        />
        </div>
    </Modal>
  )
}

export default SelectImageElementTypeModal;


const UploadType = ({image, children, setType, heading, description}) => {
  return(
    <div className={'col6'}>
      <ItemSelect
        heading={heading}
        description={description}
        onClick={setType}
        image={image}
      />
    </div>
  )
}