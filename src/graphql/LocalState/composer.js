import { gql, makeVar } from '@apollo/client';
import {getFromLS, setInLS} from '@/utils/helpers';
import { createLocalHook } from '../utils';
import {keepInBounds} from "../../utils/numberUtils";

export const COMPOSER_DOM_ID = 'interactr-composer';
export const COMPOSER_INIT_POS = 'composer:pos';
export const COMPOSER_INIT_ZOOM = 'composer:zoom';

// made like this to export it , to be used for resetting updates
export const INITIALDRAGDATA = {
  dragging: false,
  dragType: "",
  dragData: {},
  drag: {x:0, y:0},
};

const initialZoom = getFromLS(COMPOSER_INIT_ZOOM) || 0.8 ;
// const initialPos = getFromLS(COMPOSER_INIT_POS)  || {
const initialPos =  {
  x: 0,
  y: 0,
};

export const composerVar = makeVar({
  // wether or not we're currently dragging
  dragging: false,
  // type of element being dragged now , currently either NODE | CONNECTOR
  dragType: "",
  // Stores the delta of the drag from drag start to current position
  drag: {
    x: 0,
    y: 0,
  },
  zoom: initialZoom ,
  pan: { x : initialPos.x - 100 , y : initialPos.y - 100},
  // stores info about the currenly being dragged composer element
  // like the id of the node , or element type from the connector etc...
  dragData: {},
  activeNode: null,
  showEditNodeNameModal: false,
  nodes:[]
});

export const COMPOSER = gql`
  query composer {
    result: composer @client {
      dragging
      dragType
      drag
      zoom
      pan
      dragData
    }
  }
`;

export const useComposer = () => {
  return createLocalHook({
    query: COMPOSER,
    $var: composerVar,
  });
};



const MIN_ZOOM = 0.2;
const MAX_ZOOM = 2;
export const useComposerCommands = () => {

  /**
   * Helper for updating the composer local
   * state
   * @param newData
   */
  const updateComposer = (newData)=>{
    const oldData = composerVar();
    const data = {...oldData, ...newData};
    //console.log(data);
    composerVar(data);
  }

  /**
   * Handle updating the canvas zoom prop
   * @param delta
   */
  const updateZoom =  (delta) => {
    const {zoom} = composerVar();
    let newZoom = Number((zoom - delta).toFixed(2));
    newZoom = delta === 'reset' ? 0.9 : keepInBounds(MIN_ZOOM, MAX_ZOOM, newZoom);
    updateComposer({'zoom': newZoom});
    setInLS(COMPOSER_INIT_ZOOM, newZoom);
  };

  /**
   * Remove a nodeId
   * @param nodeId
   */
  const removeNode = (nodeId) => {
    const {nodes} = composerVar();
    const newNodes = nodes.filter(node => node !== nodeId);
    updateComposer({nodes: newNodes});
  }

  return {
    updateZoom, updateComposer, removeNode
  }
};