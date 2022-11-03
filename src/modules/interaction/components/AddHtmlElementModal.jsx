import React from 'react';
import Modal from "../../../components/Modal";
import {useReactiveVar} from "@apollo/client";
import { getAddInteraction, setAddInteraction } from "../../../graphql/LocalState/addInteraction";
import Icon from "../../../components/Icon";
import Button from "../../../components/Buttons/Button";
import {HtmlInput, Option} from "../../../components/PropertyEditor";


const AddHtmlElementModal = ({ close, handleCreate, loading }) => {
  const {showAddHtmlElementModal, newElement} = useReactiveVar(getAddInteraction);
  
  return (
    <Modal
      height={430}
      width={600}
      show={showAddHtmlElementModal}
      onClose={close}
      onBack={() => setAddInteraction({
        showAddHtmlElementModal: false,
        showSelectElementGroupModal: true,
      })}
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
        width="385px"
        height="225px"
        onChange={val => setAddInteraction({
          newElement: {
            ...newElement,
            html: val
          }
        })}
        />
    </Modal>
  )
}

export default AddHtmlElementModal;