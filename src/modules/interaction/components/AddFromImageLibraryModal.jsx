import React, { useEffect } from 'react';
import {useReactiveVar} from "@apollo/client";
import { getAddInteraction, setAddInteraction } from "../../../graphql/LocalState/addInteraction";
import ImageElementModal from "../../element/components/Properties/ImageElementModal";

const AddFromImageLibraryModal = ({ close, handleCreate }) => {
  const {showAddFromImageLibraryModal, newElement} = useReactiveVar(getAddInteraction);

  useEffect(() => {
    if(newElement.src) {
      handleCreate();
    }
  }, [newElement])

  const handleSubmit = (options) => {
    const { src, width, height } = options;
    setAddInteraction({
      newElement: {
        ...newElement,
        src,
        height,
        width
      }
    });
  }

  return (
    <ImageElementModal
      showStockList={showAddFromImageLibraryModal}
      close={close} 
      onBack={() => setAddInteraction({
        showAddFromImageLibraryModal: false,
        showSelectImageElementTypeModal: true
      })}
      submit={handleSubmit}
    />
  );
}

export default AddFromImageLibraryModal;