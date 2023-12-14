import React from 'react';
import {DraggableCore} from "react-draggable";
import {CONNECTOR, findDragData, isDragDisabled, NODE} from "../dragging";
import {useSetState} from "../../../utils/hooks";
import {composerVar, INITIALDRAGDATA, useComposerCommands} from "../../../graphql/LocalState/composer";
import {applyZoom, cacheModifyNode, cacheModifyButton} from "../utils";
import {useMutation, useReactiveVar} from "@apollo/client";
import {errorAlert} from "../../../utils/alert";
import {useNodeCommands} from "../../../graphql/Node/hooks";
import {cache} from "../../../graphql/client";
import {NODE_FRAGMENT} from "../../../graphql/Node/fragments";
import gql from "graphql-tag";
import reduce from 'lodash/reduce'

/**
 * We create a custom mutation here that doesn't get any data
 * back from the server. This way it doesn't update the cache
 * after response. When it does it can create issues when items
 * are click and dragged then dragged again before the response
 * comes back from the server
 * @type {DocumentNode}
 */
const MUTATION = gql`
    mutation updateNodeFromComposer($input: UpdateNodeInput) {
        updateNode(input: $input) {
            id
        }
    }
`

const BUTTON_MUTATION = gql`
    mutation updateButtonElementFromComposer($input: UpdateButtonElementInput) {
        updateButtonElement(input: $input) {
            id
        }
    }
`

/**
 * Trying to abstract as much of the draggable stuff into it's own smaller components
 * to try ahd keep thing neat clean and simple
 * @returns {JSX.Element}
 * @constructor
 */
const InteractiveSvgDraggableCore = ({children}) => {
  const [state, setState] = useSetState({
    dragging: false,
    allowPan: true,
  })

  const {updateComposer} = useComposerCommands();

  const {zoom, dragType, pan, dragData, drag} = useReactiveVar(composerVar);

  const [saveNode] = useMutation(MUTATION);
  const [saveButtonElement] = useMutation(BUTTON_MUTATION);

  /**
   * Function called when dragging starts
   * @param e
   * @returns {boolean}
   */
  function onDragStart(e) {
    let allowPan = true;

    const {target} = e;

    // If the thing being dragged has a data.disablecomposerdrag attr
    // disable dragging (it likely takes care of it itself)
    if (isDragDisabled(target)) return false;

    const { dragType, ...data } = findDragData(target) || {};

    setState({ dragging: true, allowPan });

    updateComposer({ dragging: true, dragType: dragType || '', dragData: data });
  }

  /**
   * Function called when dragging is happening
   * @param e
   * @param data
   * @private
   */
  function onDragMove(e, data) {
    // First check if the state is dragging, if not we can just return
    // so we do not move unless the user wants to move
    if (!state.dragging || isDragDisabled(e.target)) {
      return;
    }

    onDrag( applyZoom(data, zoom) );
  }

  /**
   * Move an item
   * @param coords
   */
  function onDrag(coords) {
    const { deltaX: dx, deltaY: dy, x, y } = coords;
    console.log(Math.floor(x),Math.floor(y),zoom)
    if (!dragType) {
      // we're panning since no dragtype is set on state
      updateComposer({
        pan: {
          x: pan.x - dx,
          y: pan.y - dy,
        }
      });
    }
    else  {

      if (dragType === NODE) {
        cacheModifyNode(dragData.id, {
          posX: (prevX) => {console.log(Math.floor(prevX),'x'); return prevX + dx},
          posY: (prevY) => {console.log(Math.floor(prevY),'y'); return prevY + dy},
        });
      }

      updateComposer({
        drag:  { x: drag.x + dx, y: drag.y + dy }
      });
    }
  }


  /**
   * Updates the node in Cache first then BE using
   * optimistic UI
   * @param node
   */
  function optimisticNodeUpdate(node) {
    const {id} = node;

    // Need todo this so cache.modfiy
    const fields = reduce(node, (result, value, key) => {
      return {...result, ...{[key]: ()=>value}}
    }, {})

    cacheModifyNode(id, fields);

    saveNode({
      variables: {
        input: node
      },
    }).catch((error)=>{
      console.error(error);
      errorAlert({text: "Unable to save changes to node"});
    });
  }

  function optimisticButtonUpdate(buttonElement) {
    const {id} = buttonElement;

    // Need todo this so cache.modfiy
    const fields = reduce(buttonElement, (result, value, key) => {
      return {...result, ...{[key]: ()=>value}}
    }, {})

    cacheModifyButton(id, fields);

    saveButtonElement({
      variables: {
        input: buttonElement
      },
    }).catch((error)=>{
      console.error(error);
      errorAlert({text: "Unable to save changes to node"});
    });
  }

  /**
   * Function called when dragging stops
   * @param args
   * @private
   */
  function onDragEnd(e) {
    setState({ dragging: false });

    const {target} = e;

    const endData = findDragData(target);
    //console.log('ENDING endData --- ', endData);
    // node was being dragged
    if (dragType === NODE && endData?.id) {      
      const node = cache.readFragment({
        id: `Node:${endData?.id}`,
        fragment: gql`
            fragment NodeDragFragment on Node {
                id
                posX
                posY
            }
        `,
      });
      
      optimisticNodeUpdate({
        id: endData?.id,
        posX: parseInt(node.posX),
        posY: parseInt(node.posY)
      })
    }

    // connector was being dragged
    else if (dragType === CONNECTOR) {
      // landed on a node
      if (endData?.dragType == NODE && endData?.id) {
        if(dragData?.element_type == '') {
          optimisticNodeUpdate({
            id: dragData.id, completeAction: "playNode", completeActionArg: endData.id
          })
        } else {          
          optimisticButtonUpdate({
            id: dragData.id, actionArg: endData.id
          })
        }
      }
      else {
        // Handle the connector NOT landing on a node

        // Amount of distance user can drag a connector away from the node before it registers as a
        // removal of connector from node
        const IGNORE_DIST = 20;
        function draggedMoreThan(dist) {
          return Math.abs(drag.x) > dist || Math.abs(drag.y) > dist;
        }

        // If the connector was dropped outside the node droppable area (The actual node + IGNORE_DIST) then
        // we need to remove this connection
        if (draggedMoreThan(IGNORE_DIST)) {
          const {element_type, id} = dragData;

          if (element_type) {
            // remove the element's acionArg

          } else {
            // remove the node's actionArg
            optimisticNodeUpdate({
              id, completeAction: "", completeActionArg: ""
            })
          }
        }
      }
    }

    // else {
    //   // // reset dragging state after dragging ends
    //
    // }
    updateComposer(INITIALDRAGDATA);
  }


  return (
    <DraggableCore bounds="parent" onStart={onDragStart} onStop={onDragEnd} onDrag={onDragMove}>
      {children}
    </DraggableCore>
  )
}
export default InteractiveSvgDraggableCore;