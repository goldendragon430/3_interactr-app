import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import Icon from 'components/Icon';
import Modal from 'components/Modal';
import Button from 'components/Buttons/Button';
import {
  composerVar,
  useComposerCommands
} from '@/graphql/LocalState/composer';
import Legend from './Legend';
import ZoomControl from './ZoomControl';
import reduce from 'lodash/reduce'
import InteractiveCanvas from "./InteractiveCanvas";
import {useSetState} from "../../../utils/hooks";
import {useReactiveVar} from "@apollo/client";
import {useNodeCommands} from "../../../graphql/Node/hooks";
import {cache} from "../../../graphql/client";
import gql from "graphql-tag";
import {errorAlert} from "../../../utils/alert";
import {Option, TextInput} from "../../../components/PropertyEditor";

function Composer({ project }) {
  const {updateComposer} = useComposerCommands();

  /**
   * Save all the node ids the the composer local var for performance
   * this gives us a much more granular control over re renders by allowing
   * us to just grab the node from cache when its needed at the lowest
   * possible level
   */
  const {nodes} = project;

  useEffect(()=>{
    updateComposer({nodes: reduce(project.nodes, (result, node)=>{
        return result.concat(node.id)
      }, [])})
  }, [nodes])

  return (
    <div
      style={{
        height: '100%',
        position: 'relative',
      }}
    >
      <RenameNodeModal />
      <Legend />
      <ZoomControl />

      {/*
       Abstract away all the draggable stuff as this is very resource heavy so we need to be
       careful with re renders here
      */}
      <InteractiveCanvas  startNodeId={project.start_node_id} />
    </div>
  );
}

export default Composer;

function RenameNodeModal() {
  const [state, setState] = useSetState({
    name: '',
    loading: false
  });

  const {showEditNodeNameModal, activeNode} = useReactiveVar(composerVar);

  const {updateComposer} = useComposerCommands();

  const closeModal = () => {
    updateComposer({showEditNodeNameModal: false, activeNode: null})
  };

  const {saveNode} = useNodeCommands();

  useEffect(()=>{
    if(! showEditNodeNameModal) {
      setState({
        name: '',
        loading: false,
      })
    } else {
      const node = cache.readFragment({
        id: `Node:${activeNode}`,
        fragment: gql`
            fragment NodeDragFragment on Node {
                id
                name
            }
        `,
      });
      setState({
        name: node.name
      })
    }
  }, [showEditNodeNameModal]);

  const {name, loading} = state;

  const save = async ()=>{
    setState({loading: true})
    try {
      await saveNode({
        variables: {
          input: {
            id: activeNode,
            name
          }
        }
      });

      setState({loading: false})
      closeModal();

    }catch(e){
      setState({loading: false})
      errorAlert({text: 'Unable to save changes to node'});
      console.error(e);
    }
  }

  return (
    <Modal
      heading={<><Icon name="pen-square" /> Rename Node</>}
      onClose={closeModal}
      show={showEditNodeNameModal}
      height={270}
      submitButton={
        <Button icon="save" primary onClick={() => save()} loading={loading}>
          Save
        </Button>
      }
    >
      <div className="form-control">
        <Option
          label="Enter new node name"
          value={name}
          Component={TextInput}
          onChange={val=>setState({name: val})}
          onEnter={save}
        />
      </div>
    </Modal>
  );
}
