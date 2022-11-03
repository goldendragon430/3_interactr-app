import React, { useEffect, useState } from 'react';
import Connector from './Connector';
import { WIDTH, TRUE_HEIGHT } from './Node';
import client from "../../../graphql/client";
import {NODE_FRAGMENT} from "../../../graphql/Node/fragments";
import gql from "graphql-tag";
import {cache} from "../../../graphql/client";
import {INTERACTION_FRAGMENT} from "../../../graphql/Interaction/fragments";
import {MEDIA_FRAGMENT} from "../../../graphql/Media/fragments";
import {ELEMENT_GROUP_FRAGMENT} from "../../../graphql/ElementGroup/fragments";
import {getNodeFromCache} from "../utils";
import {useReactiveVar} from "@apollo/client";
import {composerVar} from "../../../graphql/LocalState/composer";

/**
 * Taken from the connectorsSelector
 */
const generateConnectors = ({ node }) => {
  let connectors = [node, ...node.interactions].reduce((memo, item) => {
    const connector = generateConnector(item);
    if (connector) {
      memo.push(connector);
    }

    // if(item.element_type==="App\\TriggerElement"){
    //   // generate connectors for modal elements
    //   const modal = find(modals, {id: parseInt(item.element.actionArg)});
    //   if(modal && modal.elements && modal.elements.length){
    //     forEach(modal.elements, el=>{
    //       const element = find(elements[el.element_type], {id: el.element_id});
    //       if(element && element.actionArg) {
    //         const connector = generateConnector({
    //           element,
    //           element_type: el.element_type,
    //           id: element.id,
    //         });
    //         if (connector) {
    //           memo.push(connector);
    //         }
    //       }
    //     })
    //   }
    //
    // } else {
    //   const connector = generateConnector(item);
    //   if (connector) {
    //     memo.push(connector);
    //   }
    // }
    return memo;
  }, []);
  
  if (!connectors.length) {
    // we always want at least 1 connector so we can connect nodes.
    return [generateConnector({ ...node, completeAction: 'playNode' })];
  } else return connectors
};

const generateConnector = ({ element, element_type, completeAction, completeActionArg, name, id }) => {
  // Depends whether it' a node or interaction
  let action = element ? element.action : completeAction;
  let actionArg = element ? element.actionArg : completeActionArg;
  if (action !== 'playNode') {
    return;
  }
  
  return {
    // element_id over interaction.id. fallback to node.id
    id: (element && element.id) || id,
    element_type,
    destination: {
      nodeId: actionArg,
    },
    name,
  };
};

const hideIfDisconnected = (connectors) => {
  return connectors.some((connector) => !!connector.destination.nodeId);
};

export default function Connectors({ node }) {
  // We use the dragging prop to trigger re generating the connectors when
  // item stops dragging
  //const {dragging} = useReactiveVar(composerVar)

  const { posX: x, posY: y } = node;
  const [connectors, setConnectors] = useState([]);

  useEffect(() => {
    //const node = getNodeFromCache(nodeId);
    setConnectors(generateConnectors({ node }));
  }, [node]);

  if (!connectors) return null;

   // console.log('CONNECTORS===================================\n', connectors)
  return connectors.map((connector, idx) => (
    <Connector
      from={{ x: x + WIDTH, y: y + TRUE_HEIGHT / 2 }}
      // to={{x: connector.linkTo.x, y: connector.linkTo.y + HEIGHT / 2}}
      destination={connector.destination}
      key={connector.element_type + connector.id}
      id={connector.id}
      element_type={connector.element_type}
      idx={idx}
      node={node}
      name={connector.name}
      hideIfDisconnected={hideIfDisconnected(connectors)}
    />
  ));
}
