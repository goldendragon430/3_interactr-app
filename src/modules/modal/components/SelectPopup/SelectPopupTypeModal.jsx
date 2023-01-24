import React from 'react';
import {useReactiveVar} from "@apollo/client";
import Modal from "../../../../components/Modal";
import ItemSelect from "../../../../components/ItemSelect";
import { getAddModal, setAddModal } from '@/graphql/LocalState/addPopup';
import {useLocation} from "react-router-dom";
import { getAsset } from 'utils';

const SelectPopupTypeModal = ({ onClose }) => {
  const {showSelectPopupTypeModal} = useReactiveVar(getAddModal);

  const SelectType = (type) => {
    setAddModal({
      showSelectPopupTypeModal: false,
      [type]: true
    })
  };

  return (
    <>
      {
        showSelectPopupTypeModal && 
        <Modal
          height={485}
          width={885}
          show={showSelectPopupTypeModal}
          closeMaskOnClick={false}
          onClose={onClose}
          heading={'Select a Popup'}
        >
          <ModalBody SelectType={SelectType}/>
        </Modal>
      }
    </>
  )

};
export default SelectPopupTypeModal;

const ModalBody = ({SelectType}) => {
  
  const location = useLocation();

  if(location.pathname.includes('/popups')){
    return(
      <div className={'grid'}>
        <div className={'col6'}>
          <ItemSelect
            heading="Create Blank"
            description="Create a new blank popup with no preset elements"
            onClick={(()=>SelectType("showPopupNameModal"))}
            image={getAsset('/img/img-popup-create-blank.png')}
          />
        </div>
        <div className={'col6'}>
          <ItemSelect
            heading="Templates"
            description="Choose one of our pre made popup templates"
            onClick={(()=>SelectType("showSelectFromPopupTemplatesModal"))}
            image={getAsset('/img/img-popup-templates.png')}
          />
        </div>
      </div>
    )
  }

  return(
    <div className={'grid'}>
      <div className={'col4'}>
        <ItemSelect
          heading="Create Blank"
          description="Create a new blank popup with no preset elements"
          onClick={(()=>SelectType("showPopupNameModal"))}
          image={getAsset('/img/img-popup-create-blank.png')}
        />
      </div>
      <div className={'col4'}>
        <ItemSelect
          heading="My Popups"
          description="Select from one of the popups already created"
          onClick={(()=>SelectType("showSelectFromProjectPopupsModal"))}
          image={getAsset('/img/img-my-popups.png')}
        />
      </div>
      <div className={'col4'}>
        <ItemSelect
          heading="Templates"
          description="Choose one of our pre made popup templates"
          onClick={(()=>SelectType("showSelectFromPopupTemplatesModal"))}
          image={getAsset('/img/img-popup-templates.png')}
        />
      </div>
    </div>
  )
}