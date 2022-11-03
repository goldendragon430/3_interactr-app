import React, {useMemo, useState} from 'react';
import InteractiveSvg from "./InteractiveSvg";
import {
  COMPOSER_DOM_ID,
  composerVar,
  INITIALDRAGDATA,
  useComposer,
  useComposerCommands
} from "../../../graphql/LocalState/composer";
import keyBy from "lodash/keyBy";
import {applyZoom, cacheModifyNode, getNodeFromCache, scaleThePolygon} from "../utils";
import {errorAlert} from "../../../utils/alert";
import {CONNECTOR, findDragData, isDragDisabled, NODE} from "../dragging";
import {keepInBounds} from "../../../utils/numberUtils";
import Connectors from "./Connectors";
import Node from "./Node";
import StartPosition from "./StartPosition";
import {useParams} from "react-router-dom";
import {useReactiveVar} from "@apollo/client";

const InteractiveCanvas = ({nodes, startNodeId}) => {
 return(
    <InteractiveSvg>
      <Defs />
      <SvgContent
        nodes={nodes}
        startNodeId={startNodeId}
      />
    </InteractiveSvg>
  )
};
export default InteractiveCanvas;


const polygonPts = scaleThePolygon(10);

/** svg defs so we can use later with <use> */
function Defs() {
  return (
    <defs>
      <polygon id="connector-arrow" fill="#00b382" points={polygonPts} />
    </defs>
  );
}

function SvgContent({ startNodeId }) {
  const {nodes} = useReactiveVar(composerVar);

  if (Object.keys(nodes).length < 1) {
    return (
      <text x="40%" y="50%" textAnchor="middle" stroke="#002033" fontSize={20}>
        Drag Media From Your Media Library To Get Started
      </text>
    );
  }

  return (
    <g>
      <circle r="50" fill="none" />
      {Object.values(nodes).map(( nodeId) =>  <NodeWrapper key={nodeId} nodeId={nodeId} /> )}
      {(!!startNodeId) && <StartPosition startNodeId={startNodeId} />}
    </g>
  );
}

const NodeWrapper = ({nodeId}) => {
  const {removeNode} = useComposerCommands();
  // Pull the node from the cache. We no this was loaded with the project
  // but we pull each node when it's needed here to help with
  // re render performance
  const node = getNodeFromCache(nodeId);

  // Check the node exists, if not it's because it's been removed
  // from the cache so we need to update the composer var
  if(! node){
    removeNode(nodeId)
    return null;
  }

  return(
    <>
      <Connectors node={node} />
      <Node node={node} />
    </>
  )
}