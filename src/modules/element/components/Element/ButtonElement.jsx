import React from 'react';
import PropTypes from 'prop-types';
import TextElement from './TextElement';
import {getStyles, BUTTON_ELEMENT} from'modules/element/elements';
import Icon from "../../../../components/Icon";
import EditableTextContainer from "./EditableTextContainer";
import {useButtonElement, useButtonElementCommands} from "../../../../graphql/ButtonElement/hooks";
import ErrorMessage from "../../../../components/ErrorMessage";
import gql from "graphql-tag";
import {useQuery, useReactiveVar} from "@apollo/client";
import Element from "./Element";
import StaticElement from "../StaticElement";
import {playerVar} from "../../../../graphql/LocalState/player";
import ClickThrough from "../ClickThrough";
import {cache} from "../../../../graphql/client";
import {BUTTON_ELEMENT_FRAGMENT} from "../../../../graphql/ButtonElement/fragments";
import { SAVE_NODE_PAGE} from 'utils/EventEmitter';

/**
 * Required props for the component
 * @type {{id: *}}
 * @private
 */
const _props = {
  // The id of the element
  element: PropTypes.isRequired,
};

/**
 * Render a button element
 * @param id
 * @returns {*}
 * @constructor
 */
const PLAYER_QUERY = gql`
    query player {
        player @client {
            clickThruMode
        }
    }
`;
const ButtonElement = ({elementId, zIndex, selected, onDelete, onSelect, animationKey, preview}) => {
  const {updateButtonElement} = useButtonElementCommands(elementId);
  
  const element = cache.readFragment({
    id: `ButtonElement:${elementId}`,
    fragment: BUTTON_ELEMENT_FRAGMENT
  });

  const player = useReactiveVar(playerVar);

  let styles = getStyles(BUTTON_ELEMENT, element);

  const {clickThruMode} = player;

  const handleUpdate = (key, value) => {    
    updateButtonElement(key, value);

    const eventName = SAVE_NODE_PAGE;
    const event = new CustomEvent(eventName, {
      detail: {
        __typename: "ButtonElement",
        id: elementId,
        [key]: value
      },
    });
    window.dispatchEvent(event);
  }

  if(zIndex){
    styles.zIndex = zIndex;
  }
  
  if(clickThruMode) {
    return (
      <ClickThrough 
        element={element} 
        action={element.action} 
        arg={element.actionArg}
      >
        <StaticElement
          element={element}
          animationKey={animationKey}
          style={styles}
        >
          <div dangerouslySetInnerHTML={{__html: element.html}} />
        </StaticElement>
      </ClickThrough>
    )
  }

  // if(preview) {
  //   return(
  //     <StaticElement
  //       element={element}
  //       animationKey={animationKey}
  //       style={styles}
  //     >
  //       <div dangerouslySetInnerHTML={{__html: element.html}} />
  //     </StaticElement>
  //   )
  // }
  
  return (
    <EditableTextContainer
      element={element}
      update={handleUpdate}
      style={styles}
      selected={selected}
      onSelect={onSelect}
      onDelete={onDelete}
      animationKey={animationKey}
      preview={preview}
    />
  );
};
// ButtonElement.propTypes = _props;
export default ButtonElement;
