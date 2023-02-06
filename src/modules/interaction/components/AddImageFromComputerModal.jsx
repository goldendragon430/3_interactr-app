import React, {useState, useEffect} from 'react';
import Modal from "../../../components/Modal";
import Icon from "../../../components/Icon";
import Button from "../../../components/Buttons/Button";
import DropImageZone from '../../../modules/media/components/DropImageZone';

const AddImageFromComputerModal = ({ close, handleCreate, loading, newElement, show, onBack, onSuccess }) => {

  const [height, setHeight] = useState(360)

  useEffect(() => {
    if(!loading) setHeight(360)
  }, [loading])

  return (
    <Modal
      height={height}
      width={600}
      show={show}
      onClose={close}
      onBack={onBack}
      closeMaskOnClick={false}
      heading={
        <><Icon name={'plus'} />Upload Image From Your Computer</>
      }
      submitButton={
        <Button 
          loading={loading} 
          icon="plus" primary 
          onClick={handleCreate} 
          noMarginRight>Create Element</Button>
      }
    >
      <label style={{paddingBottom: 10}}>Upload your Image</label>
      <DropImageZone
        directory="imageElements"
        onSuccess={onSuccess}
        src={newElement?.src}
        width={385}
        height={250}
      />
    </Modal>
  )
}

export default AddImageFromComputerModal;
