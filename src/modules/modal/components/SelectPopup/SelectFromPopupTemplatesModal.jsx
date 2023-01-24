import React, { useState, useEffect } from 'react';
import { useQuery, useLazyQuery } from "@apollo/client";
import gql from "graphql-tag";
import { useReactiveVar } from "@apollo/client";
import Modal from "../../../../components/Modal";
import ModalListItem from "../ModalListItem";
import Icon from "../../../../components/Icon";
import { getAddModal, setAddModal } from '@/graphql/LocalState/addPopup';
import { errorAlert } from "../../../../utils/alert";
import map from "lodash/map";
import {MODAL_FRAGMENT} from "../../../../graphql/Modal/fragments";
import PopupsLoading from "./PopupsLoading";
import {getAcl} from "../../../../graphql/LocalState/acl";


const GET_TEMPLATES = gql`
    query modalTemplates{
        modalTemplates(
            orderBy: [{column: "created_at", order: DESC}]
        ) {
            ...ModalFragment
            template_name
        }
    }
    ${MODAL_FRAGMENT}
`


const SelectFromPopupTemplatesModal = ({ onClose }) => {
  const [saving, setSaving] = useState(false);

  const { showSelectFromPopupTemplatesModal, newModalObject } = useReactiveVar(getAddModal);

  const goBack = () => {
    setAddModal({
      showSelectPopupTypeModal: true,
      showSelectFromPopupTemplatesModal: false,
      newModalObject
    })
  };

  const clickHandler = async (modal) => {
    setSaving(true);
    
    setAddModal({
      newModalObject:{ ...modal },
      showSelectFromPopupTemplatesModal: false,
      showPopupNameModal: true
    });

    setSaving(false);
  }

  return(
    <>
      {
        showSelectFromPopupTemplatesModal && 
        <Modal
          height={742}
          width={1122}
          show={showSelectFromPopupTemplatesModal}
          onClose={onClose}
          onBack={goBack}
          heading={<><Icon name="list" /> Select a Popup</>}
        >
          <div className={'grid'} style={{height:'575px', overflow:'hidden',overflowY:'scroll'}}>
          {showSelectFromPopupTemplatesModal && (
              <ModalBody
                saving={saving}
                clickHandler={clickHandler}
              />
          )}
          </div>
        </Modal>
      }
    </>
  )
}

export default SelectFromPopupTemplatesModal;

const ModalBody = ({ saving, clickHandler }) => {
  const {data, loading, error} = useQuery(GET_TEMPLATES)

  const acl = useReactiveVar(getAcl);

  if(error) {
    return errorAlert({text: 'Unable to retrieve popups'})
  }

  if(loading) {
    return <PopupsLoading />
  }

  return (
    <>
      {map(data?.modalTemplates, modal => (
        <ModalListItem 
          modal={modal} 
          clickHandler={(modal)=>clickHandler(modal)} 
          loading={loading}
          canAccess={acl.canAccessPopupTemplates}
          saving={saving} />
        )
      )}
    </>
  )
}


