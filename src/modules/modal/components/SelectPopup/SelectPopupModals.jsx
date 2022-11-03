import React from 'react';
import { useReactiveVar } from "@apollo/client";
import {ADD_MODAL_VAR_INITAL_DATA, getAddModal, setAddModal} from "../../../../graphql/LocalState/addPopup";
import SelectPopupTypeModal from "./SelectPopupTypeModal";
import SelectFromPopupTemplatesModal from "./SelectFromPopupTemplatesModal";
import AddPopupNameModal from "./AddPopupNameModal";
import SelectFromProjectPopupsModal from "./SelectFromProjectPopupsModal";


const SelectPopupModals = () => {
  const { newModalObject, isPopupSelected } = useReactiveVar(getAddModal);

  const onClose = () => {
    setAddModal({
      ...ADD_MODAL_VAR_INITAL_DATA,
      isPopupSelected: false,
      newModalObject: null
    });
  }

  return(
    <>
      <SelectPopupTypeModal onClose={onClose} />
      <AddPopupNameModal onClose={onClose} />
      <SelectFromPopupTemplatesModal onClose={onClose} />
      <SelectFromProjectPopupsModal onClose={onClose} />
    </>
  )
};
export default SelectPopupModals;
