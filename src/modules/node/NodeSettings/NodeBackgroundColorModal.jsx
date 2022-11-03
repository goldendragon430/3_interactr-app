import React, { useState } from 'react';
import { useReactiveVar } from "@apollo/client";

import { ColorPicker, Icon, Modal } from 'components';
import { Button } from 'components/Buttons';
import { Option } from 'components/PropertyEditor';
import { useNodeCommands } from "@/graphql/Node/hooks";
import { 
  getNodeSettings, 
  setNodeSettings, 
  SHOW_NODE_BACKGROUND_COLOR_MODAL,
  SHOW_CHANGE_SOURCE_MEDIA_MODAL
 } from "@/graphql/LocalState/nodeSettings";

export const NodeBackgroundColorModal = ({ node }) => {
  const { activeModal } = useReactiveVar(getNodeSettings);
  const { updateNode } = useNodeCommands(node.id);

  const [_color, setColor] = useState(node.background_color);

  const saveHandler = () => {
    updateNode({
      "background_color": _color,
      "media_id" : 0
    });
    setNodeSettings({
      activeModal: ''
    })
  };

  return(
    <Modal 
      width={400} 
      height={500} 
      show={activeModal === SHOW_NODE_BACKGROUND_COLOR_MODAL} 
      onClose={() => setNodeSettings({
        activeModal: ""
      })}
      onBack={() => {
        setNodeSettings({
          activeModal: SHOW_CHANGE_SOURCE_MEDIA_MODAL
        })
      }}
      heading={<><Icon icon="palette" />Node Background Color</>}
      submitButton={
        <Button 
          primary 
          icon={'save'}  
          onClick={saveHandler}
        >Update</Button>
      }
    >
      <Option
        style={{textAlign: 'left'}}
        label="Node Background Color"
        value={_color}
        Component={ColorPicker}
        stackOrder={1}
        onChange={val=>setColor(val)}
      />
    </Modal>
  );
}; 