import Button from "../../../components/Buttons/Button";
import React, {useEffect, useState} from "react";
import {useNode, useNodeCommands, useSaveNode} from "../../../graphql/Node/hooks";
import {errorAlert} from "../../../utils/alert";
import Modal from 'components/Modal';
import Icon from "../../../components/Icon";
import ClickableElementProperties from "../../element/components/Properties/ClickableElementProperties";
import {BooleanInput, Option, RangeInput, Section, SelectInput} from "../../../components/PropertyEditor";
import {AnimatePresence, motion} from "framer-motion";
import styles from 'modules/element/components/ElementPropertiesTabs.module.scss';
import cx from "classnames";
import {animationState, preAnimationState, transition} from "../../../components/PageBody";
import {useParams} from 'react-router-dom'
import map from "lodash/map";
import AnimationPreview from "./AnimationPreview";
import gql from "graphql-tag";
import {useQuery} from "@apollo/client";

const QUERY = gql`
    query node($nodeId: ID!) {
        node(id: $nodeId) {
            id
            completeActionTimer
            completeActionSound
            completeActionDelay
            completeAction
            completeActionArg
            completeAnimation
            media_id
            media {
                id
                is_image
            }
        }
    }
`;

const NodeEndActionsButton = () => {
  const [showOnEndModal, setShowOnEndModal] = useState(false);

  const {nodeId} = useParams();

  const {data, loading, error}  = useQuery(QUERY, {
    variables: {nodeId},
    fetchPolicy: 'cache-only'
  });

  if(loading || error) return null;

  const {node} = data;

  const canSetOnEndAction = (node.media && ! node.media.is_image);

  return(
    <>
      <Button
        icon="arrow-to-right"
        text="On Node End"
        onClick={()=>setShowOnEndModal(true)}
        style={{ marginBottom: 0, marginRight: 0}}
      />
      <OnEndActionModal node={node} show={showOnEndModal} onClose={() => setShowOnEndModal(false)} />
    </>
  )
}
export default NodeEndActionsButton;


const OnEndActionModal = ({node, show, onClose}) => {
  const {updateNode, saveNode} = useNodeCommands(node.id);

  const [saving, setSaving] = useState(false);

  const [tab, setTab] = useState("action");

  const onSubmit = async () => {
    const {
      id, completeActionTimer,completeActionSound, completeActionDelay,
      completeAction, completeActionArg, completeAnimation
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
          {/*<li*/}
          {/*  className={cx(styles.headerItem, {[styles.active]: (tab==='animation')})}*/}
          {/*  onClick={()=>setTab('animation')}>*/}
          {/*  <Icon name="camera-movie"/> Exit Animation*/}
          {/*</li>*/}
          <li
            className={cx(styles.headerItem, {[styles.active]: (tab==='delay')})}
            onClick={()=>setTab('delay')}>
            <Icon name="clock"/> Delay
          </li>
        </ul>
        <div style={{padding: '20px'}}>
          <TabBody tab={tab} node={node} update={updateNode} />
        </div>
      </div>
    </Modal>
  )
};

const NodeEndAnimation = ({node, update, tabAnimation}) => {
  const {completeAnimation} = node;

  return(
    <motion.div {...tabAnimation}>
      <Option
        label={"Select an Animation"}
        value={completeAnimation}
        onChange={val=>update("completeAnimation", val)}
        Component={SelectInput}
        options={map(node_animations, (b,i)=>( {label: b.label, value:i} ) )}
      />
      <AnimationPreview completeAnimation={completeAnimation} />
    </motion.div>
  )
};


const NodeEndDelay = ({node, update, tabAnimation}) => {


  const {completeActionTimer, completeActionSound, completeActionDelay} = node;

  return(
    <motion.div {...tabAnimation}>
      <p style={{marginTop: 0}}>Add a delay to when your node end action triggers to give users time to take an action.</p>
      <p>
        Timers can also be used to encourage users to take an action before the timer expires, this can be done with or without a node action.
      </p>
      <Option
        label="Node End Action Delay (Secs)"
        value={completeActionDelay}
        Component={RangeInput}
        min={0}
        max={20}
        step={1}
        onChange={val=>update("completeActionDelay", val)}
      />
      {
        (!!completeActionDelay && completeActionDelay > 0) &&
        <AnimatePresence>
          <motion.div
            exit={preAnimationState}
            initial={preAnimationState}
            animate={animationState}
            transition={transition}>
            <Option
              label="Show A Timer"
              value={completeActionTimer}
              Component={BooleanInput}
              onChange={val=>update("completeActionTimer", val)}
            />
          </motion.div>
        </AnimatePresence>
      }
      {
        (!!completeActionDelay && completeActionDelay > 0 ) &&
        <AnimatePresence>
          <motion.div
            exit={preAnimationState}
            initial={preAnimationState}
            animate={animationState}
            transition={transition}>
            <Option
              label="Play Timer Sound"
              value={completeActionSound}
              Component={BooleanInput}
              onChange={val=>update("completeActionSound", val)}
            />
          </motion.div>
        </AnimatePresence>
      }
    </motion.div>
  )
};

const TabBody = ({tab, node, update}) => {

  const tabAnimation = {
    animate: {y: 0, opacity: 1},
    initial: {y:25, opacity: 0},
    transition: { type: "spring", duration: 0.2, bounce: 0.5, damping: 15}
  };


  switch(tab) {
    case('action') :
      return <NodeAction node={node} update={update} tabAnimation={tabAnimation} />
    case('animation') :
      return <NodeEndAnimation node={node} update={update} tabAnimation={tabAnimation}/>
    case('delay') :
      return <NodeEndDelay node={node} update={update} tabAnimation={tabAnimation} />
  }
};

const NodeAction = ({node, update, tabAnimation}) => {
  const options = {
    '': 'Do nothing',
    playNode:'Play Node',
    openUrl: 'Open Url',
    openModal: 'Open Popup',
    loop: 'Loop Video'
  };

  const {completeAction, completeActionArg} = node;

  return(
    <motion.div {...tabAnimation}>
      <ClickableElementProperties
        actionTitle="Action To Take When The Video Ends"
        actionLabel="completeAction"
        actionArgLabel="completeActionArg"
        noHeading={true}
        element={{
          action: completeAction,
          actionArg: completeActionArg,
          id: node.id,
          __typename: 'Node'
        }}
        update={update}
        onSave={update}
        className="flex-1"
        options={options}
        wrapperStyle={{
          padding: 0,
        }}
      />
    </motion.div>
  )
};
