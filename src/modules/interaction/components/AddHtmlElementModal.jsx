import React from 'react';
import Modal from "../../../components/Modal";
import Icon from "../../../components/Icon";
import Button from "../../../components/Buttons/Button";
import {HtmlInput, Option} from "../../../components/PropertyEditor";


const AddHtmlElementModal = ({ close, handleCreate, loading, newElement, show, onBack, onChange }) => {
  
  return (
    <Modal
      height={430}
      width={600}
      show={show}
      onClose={close}
      onBack={onBack}
      closeMaskOnClick={false}
      heading={
        <><Icon name={'plus'} />Paste in your HTML below</>
      }
      submitButton={
        <Button 
          loading={loading} 
          icon="plus" primary 
          onClick={handleCreate} 
          noMarginRight>Create Element</Button>
      }
    >
      <Option
        label="Paste in your HTML below"
        value={newElement?.html}
        Component={HtmlInput}
        width="560px"
        height="225px"
        onChange={onChange}
        />
    </Modal>
  )
}

export default AddHtmlElementModal;