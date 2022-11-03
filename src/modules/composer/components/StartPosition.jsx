import React, { useEffect, useState } from 'react';
import { DraggableCore } from 'react-draggable';
import {composerVar} from "../../../graphql/LocalState/composer";
import {useQuery, useReactiveVar} from "@apollo/client";
import {useProjectCommands} from "../../../graphql/Project/hooks";
import gql from "graphql-tag";
import {applyZoom, getNodeFromCache} from "../utils";
import {cache} from "../../../graphql/client";
import {findDragData, NODE} from "../dragging";
import {useParams} from "react-router-dom";
import Icon from "../../../components/Icon";


export default function StartPosition({startNodeId}) {
  const {zoom} = useReactiveVar(composerVar);

  const {projectId} = useParams();

  const node = cache.readFragment({
    id: `Node:${startNodeId}`,
    fragment: gql`
        fragment NodeDragFragment on Node {
            id
            posX
            posY
        }
    `,
  });
  
  const {updateStartNode} = useProjectCommands();

  const [state, setState] = useState({ posX: node.posX, posY: node.posY });

  const {posX, posY} = state;
  
  useEffect(() => {
    if (posX !== node.posX || posY !== node.posY) {
      setState({ posX: node.posX, posY: node.posY });
    }
  }, [node]);

  function handleDrag(e, dragObj) {
    const { deltaX: dx, deltaY: dy } = applyZoom(dragObj, zoom);
    let newStateX = state.posX;
    if (state.posX === node.posX && state.posY === node.posY) {
      // offset from mouse so that e.target isn't this element on drop
      newStateX = state.posX - 30;
    }
    setState({ posX: newStateX + dx, posY: state.posY+ dy });
  }

  function handleDragEnd(e) {
    const data = findDragData(e.target);
    if (!data || data.dragType !== NODE) {
      // Not dropped ona node so send back to original pos
      setState({ posX: node.posX, posY: node.posY  });
      return;
    }
    updateStartNode(projectId, data.id);
  }

  const translateTo = `translate(${posX + 5} ${posY + 96})`;
  return (
    <DraggableCore onDrag={handleDrag} onStop={handleDragEnd}>
      <g data-disablecomposerdrag={true} transform={translateTo}>
        <circle fill="#00b382" stroke="#f3f6fd" strokeWidth="4" r="18" />
        <text textAnchor="middle" fill="#fff" stroke="#fff" dy=".3em">
          S
        </text>
      </g>
    </DraggableCore>
  );
}
