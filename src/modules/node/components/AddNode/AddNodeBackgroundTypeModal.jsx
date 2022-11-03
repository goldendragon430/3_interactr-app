import React from 'react';
import {useReactiveVar} from "@apollo/client";
import {ADD_NODE_VAR_INITAL_DATA, getAddNode, setAddNode} from "../../../../graphql/LocalState/addNode";
import Modal from "../../../../components/Modal";
import {setAddMedia} from "../../../../graphql/LocalState/addMedia";
import Icon from "../../../../components/Icon";
import ItemSelect from "../../../../components/ItemSelect";
import getAsset from "../../../../utils/getAsset";

const AddNodeBackgroundTypeModal = ({onClose}) => {
  const {showBackgroundTypeSelectModal} = useReactiveVar(getAddNode);

  const SelectType = (type, staticNode = false) => {
    setAddNode({
      showBackgroundTypeSelectModal: false,
      [type]: true,
      staticNode
    })
  };

  return (
    <Modal
      height={485}
      width={650}
      show={showBackgroundTypeSelectModal}
      closeMaskOnClick={false}
      onClose={onClose}
      heading={
        <><Icon name={'plus'} /> Select a background type for your node</>
      }
    >
      <div className={'grid'}>
        <div className={'col6'}>
          <ItemSelect
            heading={"Media"}
            description={"Use an image or video as the node background"}
            onClick={()=>SelectType("showBackgroundMediaSelectModal", false)}
            image={getAsset('/img/img-node-background-media.png')}
          />
        </div>
        <div className={'col6'}>
          <ItemSelect
            heading={"Solid Color"}
            description={"Use a solid color as the node background"}
            onClick={()=>SelectType("showBackgroundColorSelectModal", true)}
            image={getAsset('/img/img-node-background-solid-color.png')}
          />
        </div>
      </div>
    </Modal>
  )

};
export default AddNodeBackgroundTypeModal;