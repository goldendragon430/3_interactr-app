import React, {useState} from 'react'
import {useReactiveVar} from "@apollo/client";
import {
  ADD_NODE_VAR_INITAL_DATA,
  getAddNode,
  setAddNode,
} from "../../../../graphql/LocalState/addNode";
import Modal from "../../../../components/Modal";
import Icon from "../../../../components/Icon";
import Button from "../../../../components/Buttons/Button";
import {Option, RangeInput, TextInput} from "../../../../components/PropertyEditor";
import SourceMediaPreview from "../../../media/components/mediaLibrarySidebar/SourceMediaPreview";
import {errorAlert} from "../../../../utils/alert";
import {useNodeCommands} from "../../../../graphql/Node/hooks";
import {useProjectCommands} from "../../../../graphql/Project/hooks";

const AddNodeNameModal = ({onClose, project}) => {
  const {showNameSelectModal, newNodeObject, staticNode} = useReactiveVar(getAddNode);

  const [loading, setLoading] = useState(false);

  const [name, setName] = useState("");

  const [duration, setDuration]  = useState(0);

  const {createNode} = useNodeCommands();
  const {updateStartNode} = useProjectCommands();
  
  const goBack = () => {
    setName("")

    if(newNodeObject.media_id) {
      setAddNode({
        showNameSelectModal: false,
        showBackgroundMediaSelectModal: true,
      })
    }
    else {
      setAddNode({
        showNameSelectModal: false,
        showBackgroundColorSelectModal: true,
      })
    }
  };

  const onSubmit = async () => {
    if(! name) {
      errorAlert({text: 'The node has no name'})
      return;
    }

    setLoading(true);

    try {
      const { data: { createNode: newNode } } = await createNode({
        variables: {
          input: {
            ...newNodeObject, ...{name, duration}
          }
        }
      })

      if(! project.start_node_id) {
        await updateStartNode(newNode.project_id, newNode.id);
      }
      
      setAddNode(ADD_NODE_VAR_INITAL_DATA);
      setLoading(false);
      setName("")
    }
    catch(e){
      console.error(e);
      errorAlert({text: 'Error creating new node'})
      setLoading(false)
    }

  };

  const {media_id, background_color} = newNodeObject;

  return(
    <Modal
      height={730}
      width={700}
      show={showNameSelectModal}
      closeMaskOnClick={false}
      onClose={onClose}
      onBack={goBack}
      heading={
        <><Icon name={'plus'} /> Give the node a name</>
      }
      submitButton={
        <Button
          onClick={onSubmit}
          primary
          icon={'plus'}
          loading={loading}
        >
          Add New Node
        </Button>
      }
    >
      <Option
        label="Node Name"
        Component={TextInput}
        value={name}
        onEnter={onSubmit}
        onChange={val => setName(val)}
      />
      {(staticNode &&  <NodeDuration duration={duration} setDuration={setDuration} /> )}
      <label>Preview</label>
      <div style={{width: '100%', margin: '0 auto'}}>
        <SourceMediaPreview
          mediaId={media_id}
          name={name}
          setName={setName}
          background_color={background_color}
        />
      </div>
    </Modal>
  )
};
export default AddNodeNameModal;

const NodeDuration = ({duration, setDuration}) => {
  const [val, setVal] = useState(duration);

  return (
    <>
      <div style={{paddingLeft: 5, paddingRight: 0}}>
        <Option
          label="Node Duration"
          value={val}
          Component={RangeInput}
          onAfterChange={val=>setDuration(val)}
          onChange={val=>setVal(val)}
          min={0}
          max={120}
          step={1}
        />
      </div>
      <p>When not using a video for the node background you need to give the node a duration. This is how long it will last, setting this to 60 would be the same as having a video background with a 60 second duration.</p>
    </>
  )
};