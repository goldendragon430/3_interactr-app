import React from 'react';
import PropTypes from "prop-types";
import Icon from "../../../../components/Icon";
import EditableTextContainer from "./EditableTextContainer";
import {useTextElement, useTextElementCommands} from "../../../../graphql/TextElement/hooks";
import ErrorMessage from "../../../../components/ErrorMessage";
import {getStyles, TEXT_ELEMENT} from 'modules/element/elements';
import gql from "graphql-tag";
import {useQuery} from "@apollo/client";
import Element from "./Element";
import StaticElement from "../StaticElement";
import {cache} from "../../../../graphql/client";
import {BUTTON_ELEMENT_FRAGMENT} from "../../../../graphql/ButtonElement/fragments";
import {TEXT_ELEMENT_FRAGMENT} from "../../../../graphql/TextElement/fragments";
import { SAVE_NODE_PAGE} from 'utils/EventEmitter';

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
 * Render the editable text element
 * @constructor
 */
const TextElement = ({elementId, selected, onSelect, onDelete, animationKey, preview}) => {
  const {updateTextElement, saveTextElement} = useTextElementCommands(elementId);

  const element = cache.readFragment({
    id: `TextElement:${elementId}`,
    fragment: TEXT_ELEMENT_FRAGMENT
  });

  const styles = getStyles(TEXT_ELEMENT, element);

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
  const handleUpdate = (key, value) => {    
    updateTextElement(key, value);

    const eventName = SAVE_NODE_PAGE;
    const event = new CustomEvent(eventName, {
      detail: {
        __typename: "TextElement",
        id: elementId,
        [key]: value
      },
    });
    window.dispatchEvent(event);
  }

  return (
    <EditableTextContainer
      element={element}
      style={styles}
      selected={selected}
      onSelect={onSelect}
      save={saveTextElement}
      update={handleUpdate}
      onDelete={onDelete}
      animationKey={animationKey}
      preview={preview}
    />
  );
};
TextElement.propType = _props;
export default TextElement;