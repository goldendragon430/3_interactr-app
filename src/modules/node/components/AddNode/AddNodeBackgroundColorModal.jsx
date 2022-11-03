import React from 'react';
import Modal from "../../../../components/Modal";
import {useReactiveVar} from "@apollo/client";
import {getAddNode, setAddNode} from "../../../../graphql/LocalState/addNode";
import {setAddMedia} from "../../../../graphql/LocalState/addMedia";
import Icon from "../../../../components/Icon";
import {ColorInput, Option} from "../../../../components/PropertyEditor";
import Button from "../../../../components/Buttons/Button";
import {SketchPicker} from "react-color";

const AddNodeBackgroundColorModal = ({onClose}) => {
  const {showBackgroundColorSelectModal, newNodeObject} = useReactiveVar(getAddNode);

  const goBack = () => {
    setAddNode({
      showBackgroundTypeSelectModal: true,
      showBackgroundColorSelectModal: false
    })
  };

  const {background_color} = newNodeObject;

  if(! background_color) {
    setAddNode({
      newNodeObject: {background_color: 'rgba(47,47,183,1)'}
    });
  }

  const handleChange = ({rgb}) => {
    const {r, g, b, a} = rgb;

    setAddNode({
      newNodeObject: {background_color: `rgba(${r}, ${g}, ${b}, ${a})`}
    })
  }

  return (
    <Modal
      height={550}
      width={350}
      show={showBackgroundColorSelectModal}
      closeMaskOnClick={false}
      onClose={onClose}
      onBack={goBack}
      heading={
        <><Icon name={'paint-brush'} /> Choose a background color</>
      }
      submitButton={
        <Button
          onClick={()=>setAddNode({showBackgroundColorSelectModal: false,showNameSelectModal: true })}
          primary
        >
          Next <Icon name={'arrow-right'} />
        </Button>
      }
    >
      <div style={{paddingLeft: '15px'}}>
        <label>Select Color</label>
        <SketchPicker color={background_color || ""} onChange={handleChange} />
      </div>
    </Modal>
  );
};
export default AddNodeBackgroundColorModal;