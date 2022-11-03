import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useReactiveVar } from "@apollo/client";

import { Icon, Modal } from 'components';
import { Button } from 'components/Buttons';
import { useNodeCommands } from "@/graphql/Node/hooks";
import { NodeProperties } from "../NodeProperties";

import { 
  getNodeSettings, 
  setNodeSettings, 
  SHOW_NODE_SETTINGS_MODAL 
} from "@/graphql/LocalState/nodeSettings";

export const NodeSettingsModal = ({ node }) => {
  const { activeModal } = useReactiveVar(getNodeSettings);
  // const { saveNode } = useNodeCommands();
  // const [name, setName] = useState('');
  // const [saving, setSaving] = useState(false);

  // const saveChanges = async ()=> {
  //   try {
  //     setSaving(true);
  //     let {id, media_id, background_color, duration, name} = node;

  //     // Ensure duration is always set correctly 
  //     if(! node.media_id || node.media.is_image) {
  //       if(! duration){
  //         duration = 20;
  //       }
  //     }

  //     if(node.media_id && ! node.media.is_image) {
  //       duration = 0;
  //     }

  //     await saveNode({
  //      variables: {
  //        input: {id, media_id, name, background_color, duration}
  //      }
  //     });

  //   } catch (err) {
  //     console.error(err);
  //     errorAlert({text: 'Unable to save changes'})
  //   }

  //   setSaving(false);
  // }

  return(
    <Modal 
      width={650} 
      height={720} 
      show={activeModal === SHOW_NODE_SETTINGS_MODAL} 
      onClose={() => setNodeSettings({
        activeModal: ""
      })}
      heading={<><Icon icon="sliders-v" />Node Settings</>}
      submitButton={
        <Button 
          primary 
          icon={'save'} 
          // loading={saving}
          // onClick={saveChanges}>Save Changes
          onClick={() => {
            setNodeSettings({
              activeModal: ''
            })
          }}>Update
        </Button>
      }
      onBack={() => {
        setNodeSettings({
          activeModal: ''
        })
      }}
    >
      <NodeProperties node={node} />
    </Modal>
  )
};

NodeSettingsModal.propTypes = {
  show: PropTypes.bool.isRequired,
  setShowModal: PropTypes.func.isRequired
}