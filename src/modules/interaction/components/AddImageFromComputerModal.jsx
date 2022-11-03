import React, {useState, useEffect} from 'react';
import Modal from "../../../components/Modal";
import {useReactiveVar} from "@apollo/client";
import { getAddInteraction, setAddInteraction } from "../../../graphql/LocalState/addInteraction";
import Icon from "../../../components/Icon";
import Button from "../../../components/Buttons/Button";
import DropImageZone from '../../../modules/media/components/DropImageZone';


const AddImageFromComputerModal = ({ close, handleCreate, loading }) => {
  const {showAddImageFromComputerModal, newElement} = useReactiveVar(getAddInteraction);
  const [height, setHeight] = useState(360)

  useEffect(() => {
    if(!loading) setHeight(360)
  }, [loading])

  return (
    <Modal
      height={height}
      width={600}
      show={showAddImageFromComputerModal}
      onClose={close}
      onBack={() => setAddInteraction({
        showAddImageFromComputerModal: false,
        showSelectImageElementTypeModal: true
      })}
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
        onSuccess={({src}) => {
          setHeight(630);
          setAddInteraction({
            newElement: {
              ...newElement,
              src,
            }
          });
        }}
        src={newElement?.src}
        width={385}
        height={250}
      />
    </Modal>
  )
}

export default AddImageFromComputerModal;
