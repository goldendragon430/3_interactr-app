import React from 'react';
import { useReactiveVar } from "@apollo/client";
import gql from "graphql-tag";
import PropTypes from "prop-types";
import { cache } from "../../../../graphql/client";
import { IMAGE_ELEMENT_FRAGMENT } from "../../../../graphql/ImageElement/fragments";
import { useImageElementCommands } from "../../../../graphql/ImageElement/hooks";
import { playerVar } from "../../../../graphql/LocalState/player";
import ClickThrough from "../ClickThrough";
import StaticElement from "../StaticElement";
import PositionableElement from './PositionableElement';

/**
 * Required props for the component
 * @type {{id: *}}
 * @private
 */
const _props = {
  // The id of the element
  element: PropTypes.isRequired
};



/**
 * Render a Image element
 * @param id
 * @constructor
 */
const PLAYER_QUERY = gql`
    query player {
        player @client {
            clickThruMode
        }
    }
`;
const ImageElement = ({elementId, selected, onSelect, onDelete, animationKey, preview}) => {
  const {updateImageElement, saveImageElement} = useImageElementCommands(elementId);

  const element = cache.readFragment({
    id: `ImageElement:${elementId}`,
    fragment: IMAGE_ELEMENT_FRAGMENT
  });

  const player = useReactiveVar(playerVar);

  const {src} = element;
  
  const content = (
    src && (
      <img
        src={src}
        style={{width: '100%', height: '100%', opacity: element.opacity}}
        draggable={false}
      />
    )
  )

  const {clickThruMode} = player;

  if(clickThruMode) {
    return (
      <ClickThrough element={element}>
        <StaticElement
          element={element}
          animationKey={animationKey}
        >
          {content}
        </StaticElement>
      </ClickThrough>
    )
  }

  // if(preview) {
  //   return(
  //     <StaticElement
  //       element={element}
  //       animationKey={animationKey}
  //     >
  //       {content}
  //     </StaticElement>
  //   )
  // }

  return <PositionableElement
    element={element}
    update={updateImageElement}
    save={saveImageElement}
    style={{
      border: !src && '1px dashed #eee',
      height:'100%',
    }}
    selected={selected}
    onSelect={onSelect}
    onDelete={onDelete}
    animationKey={animationKey}
    preview={preview}
  >
    {content}
  </PositionableElement>
};
//ImageElement.propTypes = _props;
export default ImageElement;