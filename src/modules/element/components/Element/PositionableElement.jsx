import React from 'react';
import DraggableResizable from 'components/DraggableResizable';
import Element from './Element';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/client';
import Emitter, {SAVE_MODAL_PAGE, SAVE_NODE_PAGE} from '../../../../utils/EventEmitter';
import math from 'math.js';
import {useParams} from 'react-router-dom'
import {cache} from "@/graphql/client";
import mapValues from 'lodash/mapValues';

const PLAYER_QUERY = gql`
  query player {
    player @client {
      clickThruMode
    }
  }
`;
//TODO handler props need better naming ?
const PositionableElement = ({
  element,
  style = {},
  disabled,
  children,
  // update,
  // save,
  selected,
  onSelect,
  onDelete,
  animationKey,
  editing,
  vResizeDisabled=false,
  preview
}) => {
  const { data, loading, error } = useQuery(PLAYER_QUERY);
  const {modalId} = useParams();

  if (loading || error) return null;

  const { posX: x, posY: y, width: w, height: h, animation } = element;
  const { clickThruMode } = data.player;

  // Show the users that element can be moved by changing the cursor
  style.cursor = 'move';

  const updateModalElementCache = (id, __typename, key, value) => {
    const fields = (typeof key === 'object') ?
        mapValues(key, (k)=>{
          return ()=>{ return k }
        })
        : {[key]: ()=>{return value}}

      const cacheKey = cache.identify({id: id, __typename: __typename});
      cache.modify({
        id: cacheKey,
        fields
      });
  }

  const handleSaveDimensions = ({ x: posX, y: posY, w: width, h: height }) => {
    const { __typename, id } = element;
    if(modalId) {
      updateModalElementCache(id, __typename, 'posX', math.round(posX, 4));
      updateModalElementCache(id, __typename, 'posY', math.round(posY, 4));
      updateModalElementCache(id, __typename, 'width', math.round(width, 4));
      updateModalElementCache(id, __typename, 'height', math.round(height, 4));
    } else {
      const eventName = SAVE_NODE_PAGE;
      const event = new CustomEvent(eventName, {
        detail: {
          __typename,
          id,
          posX: math.round(posX, 4),
          posY: math.round(posY, 4),
          width: math.round(width, 4),
          height: math.round(height, 4), 
        },
      });
      window.dispatchEvent(event);
      // TODO we may come back to this later so save would be a mutation that only updates the variables here not
      // save the whole node editor cache. Will leave the save function as a passed down prop and avoid cleaning it all
      // up just yet until we've settled on an approach here
      // save({variables: {
      //   input:{
      //     id: element.id,
      //     posX, posY, height, width
      //   }
      //   }})
    }
  };
  
  return (
    <DraggableResizable
      bounds="parent"
      pos={{ x, y }}
      size={{ w, h }}
      onSave={handleSaveDimensions}
      // onChange={handleChangeDimensions}
      disabled={disabled || clickThruMode}
      minWidth={20}
      zIndex={style.zIndex || element.zIndex}
      selected={selected}
      vResizeDisabled={vResizeDisabled}
    >
      <Element
        style={style}
        animation={animation}
        selected={selected}
        onSelect={onSelect}
        onDelete={onDelete}
        element={element}
        animationKey={animationKey}
        id={element.id}
        editing={editing}
        preview={preview}
        vResizeDisabled={vResizeDisabled}
      >
        {children}
      </Element>
    </DraggableResizable>
  );
};
export default PositionableElement;
