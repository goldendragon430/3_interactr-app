import React, { Component, useContext, useEffect, useMemo, useRef, useState } from 'react';
//import onClickOutside from 'react-onclickoutside';
import keyDown from 'react-keydown';
import { CONNECTOR, dragDataSetter } from 'modules/composer/dragging';
import { TRUE_HEIGHT } from 'modules/composer/components/Node';
import { nodeAndParents } from 'utils/domUtils';
import { getNodeFromCache } from '../utils';
import ProjectCanvasContext from 'modules/project/components/ProjectCanvasContext';
import {useReactiveVar} from "@apollo/client";
import {composerVar} from "../../../graphql/LocalState/composer";

const setConnectorData = dragDataSetter(CONNECTOR);

function calculateDestination(composerState, props) {
  let { destination, from, element_type, id } = props;

  let { dragType, drag, dragData } = composerState;
  //console.log(destination)
  if (destination || dragType === CONNECTOR) {
    let toPos;

    if (destination.nodeId) {
      const node = getNodeFromCache(destination.nodeId);
      // console.log('got node while calculating .... position ', node)
      if (!node) return;
      toPos = { x: node.posX, y: node.posY + TRUE_HEIGHT / 2 };
    } else if (destination.pos) {

      // 👈 haven't found case for this yet
      toPos = destination.pos;
    }

    // this one is currently being dragged
    if (
      dragType === CONNECTOR &&
      dragData &&
      dragData.id == id &&
      (!dragData.element_type || dragData.element_type == element_type)
    ) {
      toPos = {
        x: (toPos ? toPos.x : from.x) + drag.x,
        y: (toPos ? toPos.y : from.y) + drag.y,
      };
      // console.log("connector next position ========= " , toPos)
      // console.log("connector from position ========= " , from)
      // console.log("drag position ========= " , drag)

    }

    return toPos;
  }
}

export default function Connector(props) {
  const [selected, setSelected] = useState(false);

  const composer = useReactiveVar(composerVar);

  const toPos = useMemo(() => calculateDestination(composer, props), [composer, props]);

  const { nodeId, element_type, id, to, from, name, hideIfDisconnected } = props;
  // console.log('logging the toPos from the connector ', id, ' ---> ', toPos);

  const connectorRef = useRef(null);
  const arrowRef = useRef(null);
  const circleRef = useRef(null);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    setConnectorData(circleRef.current, props);
    setConnectorData(arrowRef.current, props);
    // setConnectorData(connectorRef.current, props);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  function handleClick(e) {
    setSelected(true);
  }

  const handleClickOutside = (e) => {
    setSelected(false);
  };

  function handleKeyDown(e) {
    if (['delete', 'backspace'].includes(e.key)) {
      handleDelete();
    }
  }

  function handleDelete() {
    // if (selected) {
    //   if (to.nodeId) {
    //     removeConnector(element_type, id);
    //   }
    // }
  }

  function removeConnector(element_type, id) {}

  const pathString = toPos && pathBetween(from, toPos);

  if (hideIfDisconnected && !toPos) {
    return null;
  }

  /**
   * Easy way to tweak the position of the connector on the node
   */
  const connectorPos = toPos
    ? {
        x: toPos.x - 1,
        y: toPos.y,
      }
    : {
        x: from.x + 10,
        y: from.y,
      };

  const strokeColour = element_type ? '0, 162, 225' : '0, 179, 130';
  // const transformStyle  = (x=connectorPos.x,y=connectorPos.y) => ({transformOrigin: '0 0', transform: `translate(${x}px, ${y}px`})
  // const transformStyle  = (x=connectorPos.x,y=connectorPos.y) => (`translate(${x} ${y})`)
  return (
    <g onClick={handleClick} ref={connectorRef}>
      {pathString && (
        <path
          d={pathString}
          stroke={`rgba(${strokeColour}, ${selected ? 0.5 : 0.2})`}
          strokeLinejoin="round"
          strokeWidth={10}
          fill="none"
          // onClick={this.handleClick}
        />
      )}
      <circle ref={circleRef} r={14}  fill="#eafdf4" cx={connectorPos.x}  cy={connectorPos.y} />
      <use ref={arrowRef} xlinkHref="#connector-arrow" x={connectorPos.x - 8}  y={connectorPos.y - 8}  />
      {/* <use ref={arrowRef} x={connectorPos.x - 8} y={connectorPos.y - 8} xlinkHref="#connector-arrow" style={transformStyle} /> */}
    </g>
  );
}

function pathBetween(from, to) {
  const padding = 20;
  const xDist = to.x - from.x;
  const yDist = to.y - from.y;

  const start = `M${from.x} ${from.y} `;

  if (to.x > from.x) {
    return `${start} h ${xDist / 2} v ${yDist} h ${xDist / 2}`;
  }

  const long = xDist + padding * (xDist > 0 ? 2 : -2);
  return `${start} h ${padding} v ${yDist / 2} h ${long} v ${yDist / 2} h ${padding}`;
}

// function distance({ x, y }, { x: x2, y: y2 }) {
//   return Math.sqrt(Math.pow(x2 - x, 2) + Math.pow(y2 - y, 2));
// }

// function bezierCurve(from, to) {
//   const dist = distance(from, to);
//   const { x, y } = from;
//   console.log(from, to);
//   return `M${x} ${y}, C ${x + dist * 0.25} ${y}, ${to.x - dist * 0.75} ${to.y}, ${to.x} ${to.y}`;
//   // return `M${x} ${y}, Q ${x + dist * 0.5} ${y}, ${to.x} ${to.y}`;
// }
