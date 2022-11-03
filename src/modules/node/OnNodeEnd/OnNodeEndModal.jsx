import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Modal from 'components/Modal';
import cx from "classnames";

import { Icon } from "components";
import { Button } from 'components/Buttons';
import { OnNodeEndTabs } from './OnNodeEndTabs';
import { useNodeCommands } from "@/graphql/Node/hooks";
import { errorAlert } from "utils/alert";

import styles from 'modules/element/components/ElementPropertiesTabs.module.scss';

export const OnNodeEndModal = ({node, show, onClose}) => {
  const {updateNode, saveNode} = useNodeCommands(node.id);
  const [saving, setSaving] = useState(false);
  const [tab, setTab] = useState("action");

  const onSubmit = async () => {
    const {
      id, 
      completeActionTimer,
      completeActionSound, 
      completeActionDelay,
      completeAction, 
      completeActionArg, 
      completeAnimation
    } = node;

    try {
      setSaving(true);
      // Save the fields than can be edited in this modal
      const req = await saveNode({
        variables:{
          input:{
            id, completeActionTimer,completeActionSound, completeActionDelay,
            completeAction, completeActionArg, completeAnimation
          }
        }
      });
      onClose();

    }catch(err){
      console.error(err);
      errorAlert({
        text: 'Unable to save node'
      })
    }
    setSaving(false)
  };

  return(
    <Modal 
      width={550} 
      height={750} 
      show={show} 
      onClose={onClose}
      heading={
        <>
          <Icon icon="arrow-to-right" />
          On Node End
        </>
      }
      submitButton={
        <Button icon="save" primary right loading={saving} onClick={onSubmit}>Save Changes</Button>
      }
    >
      <div style={{textAlign: 'left'}}>
        <ul className={styles.headerWrapper} style={{marginTop: '-5px'}}>
          <li
            className={cx(styles.headerItem, {[styles.active]: (tab==='action')})}
            onClick={()=>setTab('action')}>
            <Icon name="mouse-pointer"/> Action
          </li>
          {/* Commented out will add this in the next release */}
          <li
            className={cx(styles.headerItem, {[styles.active]: (tab==='animation')})}
            onClick={()=>setTab('animation')}>
            <Icon name="camera-movie"/> Exit Animation
          </li>
          <li
            className={cx(styles.headerItem, {[styles.active]: (tab==='delay')})}
            onClick={()=>setTab('delay')}>
            <Icon name="clock"/> Delay
          </li>
        </ul>
        <div style={{padding: '20px'}}>
          <OnNodeEndTabs tab={tab} node={node} update={updateNode} />
        </div>
      </div>
    </Modal>
  )
};

OnNodeEndModal.propTypes = {
  node: PropTypes.element.isRequired,
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired
}

