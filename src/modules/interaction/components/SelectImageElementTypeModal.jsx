import React from 'react';
import Modal from "../../../components/Modal";
import {useReactiveVar} from "@apollo/client";
import { ADD_INTERACTION_VAR_INITIAL_DATA, getAddInteraction, setAddInteraction } from "../../../graphql/LocalState/addInteraction";
import Icon from "../../../components/Icon";
import getAsset from "../../../utils/getAsset";
import ItemSelect from "../../../components/ItemSelect";


const SelectImageElementTypeModal = ({ close }) => {
  const {showSelectImageElementTypeModal} = useReactiveVar(getAddInteraction);

  return (
    <Modal
      height={465}
      width={630}
      show={showSelectImageElementTypeModal}
      onClose={close}
      onBack={() => setAddInteraction({
        // ...ADD_INTERACTION_VAR_INITIAL_DATA,
        showSelectElementGroupModal: true,
        showSelectImageElementTypeModal: false
      })}
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
          setType={() => setAddInteraction({
            // ...ADD_INTERACTION_VAR_INITIAL_DATA,
            showSelectImageElementTypeModal: false,
            showAddFromImageLibraryModal: true,
          })}
        />
        <UploadType
          heading={'Upload File'}
          description={'Upload an image file from your computer'}
          image={getAsset('/img/avatar-logo.png')}
          setType={() => setAddInteraction({
            // ...ADD_INTERACTION_VAR_INITIAL_DATA,
            showSelectImageElementTypeModal: false,
            showAddImageFromComputerModal: true,
          })}
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