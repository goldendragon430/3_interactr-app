import {nodeAndParents} from 'utils/domUtils';


// TODO: should this be moved to src/utils?

/** 
 * @typedef DomNode
 * @type {HTMLElement | SVGElement}
*/

/** 
 * @typedef DragData
 * @type {Object} dragData
 * @property {(node:DomNode, props:object) => void} set sets the drag needed attributes on the dom node 
 * @property {(node:DomNode) => {dragType, id,...}} get gets an object of the attributes and their values  
 * 
*/

/** @typedef DragType 
 * @type {String} { CONNECTOR | NODE } 
 */

/** @typedef DragDataHelper
 * @type {Object}
 * @property {DragData} CONNECTOR 
 * @property {DragData} NODE 
 */



// dragTypes
/** @type {DragType } */
export const CONNECTOR = 'CONNECTOR';
/** @type {DragType } */
export const NODE = 'NODE';


/**  Creates a util for reading and writing node drag data 
 * @param {DragType} dragType 
 * @param {[string]} requiredProps 
 * @returns {DragData}
 */
function dragDataFactory (dragType, requiredProps = []) { 
  return Object.freeze({
    set(node, props) {
      requiredProps.forEach(key => {
        const prop = props[key];
        if (typeof prop == 'undefined' && window.__DEV__) {
          console.warn(`Missing prop ${key}`);
        }
        node.dataset[key] = prop || '';
      });

      node.dataset.dragType = dragType;
    },

    get(node) {
      if (node.dataset.dragType !== dragType) {
        throw new Error('Incorrect dragType');
      }

      return [...requiredProps, 'dragType'].reduce((data, key) => {
        const value = node.dataset[key];
        if (typeof value === 'undefined') {
          throw new Error(`Node is missing required data prop ${key}`);
        }
        return {...data, [key]: value};
      }, {});
    }
  })
}

/** @type {DragDataHelper} */
export const DRAG_DATA_HELPERS = {
  [CONNECTOR]: dragDataFactory(CONNECTOR, ['nodeId', 'element_type', 'id']),
  [NODE]: dragDataFactory(NODE, ['id'])
};

/** Finds the draggable DOM element in ancestry of the passed DOM node
 * @param { DomNode } node
 */
export function findDraggableNode(node) {
  return nodeAndParents(node).find(n => n.dataset.dragType);
}

/** 
 * @param {DomNode} draggableNode
 * @return {DragData}
 */
export function getDragHelper(draggableNode) {
  return DRAG_DATA_HELPERS[draggableNode.dataset.dragType];
}

/** @param {DomNode} draggableNode */
export function getDragData(draggableNode) {
  return getDragHelper(draggableNode).get(draggableNode);
}

/**
 * 
 * @param {DomNode} node 
 */
export function findDragData(node) {
  const draggableNode = findDraggableNode(node);
  return draggableNode && getDragData(draggableNode);
}

// looks through node and parents for a drag type
export function findDragType(node) {
  const data = findDragData(node);
  return data && data.dragType;
}

/** 
 * @param {DragType} dragType
 * @retuns {function(node:DomNode)}
 */
export const dragDataSetter = dragType => {
  const helper = DRAG_DATA_HELPERS[dragType];
  if (!helper) throw new Error(`invalid dragType ${dragType}`);

  return function(node, props) {
    if (!node) return;
    helper.set(node, props);
  };
};

// Gets info on drop event relative to the specified domId
// i.e. returns relative position if the domId was the drop target/an ancestor
// else returns false
export function getRelativeDrop(domId, e) {
  // Make sure it's a drop on the composer
  const matchingNode = nodeAndParents(e.target).find(el => el.id === domId);
  if (!matchingNode) {
    return false;
  }

  const {clientX, clientY} = e;
  const {left, top} = matchingNode.getBoundingClientRect();

  // relative to node
  const x = clientX - left;
  const y = clientY - top;

  return {x, y};
}


/** @param {DomNode} target */
export function isDragDisabled(target) {
  return !!nodeAndParents(target).find((node) => node.dataset.disablecomposerdrag);
}