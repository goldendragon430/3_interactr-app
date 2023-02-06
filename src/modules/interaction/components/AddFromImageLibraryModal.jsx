import React, { useEffect } from 'react';
import ImageElementModal from "../../element/components/Properties/ImageElementModal";

const AddFromImageLibraryModal = ({ close, handleCreate, newElement, show, handleSubmit, onBack }) => {

  useEffect(() => {
    if(newElement.src) {
      handleCreate();
    }
  }, [newElement])

  return (
    <ImageElementModal
      showStockList={show}
      close={close} 
      onBack={onBack}
      submit={handleSubmit}
    />
  );
}

export default AddFromImageLibraryModal;