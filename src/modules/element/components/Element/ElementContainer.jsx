import React from 'react';
import PropTypes from 'prop-types';
import HotspotElement from 'modules/element/components/Element/HotspotElement';
import ButtonElement from 'modules/element/components/Element/ButtonElement';
import ImageElement from 'modules/element/components/Element/ImageElement';
import TextElement from 'modules/element/components/Element/TextElement';
import FormElement from 'modules/element/components/Element/FormElement';
import CustomHtmlElement from 'modules/element/components/Element/CustomHtmlElement';
import {
  HOTSPOT_ELEMENT,
  BUTTON_ELEMENT,
  IMAGE_ELEMENT,
  TEXT_ELEMENT,
  CUSTOM_HTML_ELEMENT,
  FORM_ELEMENT, TRIGGER_ELEMENT
} from 'modules/element/elements';
import TriggerElement from "./TriggerElement";

/**
 * Props needed for this component
 * @type {{element_id: shim, element_type: shim}}
 * @private
 */
const _props = {
  // Id of the element
  element_id : PropTypes.number,
  // The element type
  element_type : PropTypes.string,
};

/**
 * The element container receives the element id and type and renders
 * out the element
 * @param element_id
 * @param element_type
 * @param interaction_id
 * @constructor
 */
const ElementContainer = ({element, zIndex, element_type, selected, onSelect, onDelete, animationKey, preview}) => {
  switch (element_type) {
    case HOTSPOT_ELEMENT:
      return <HotspotElement elementId={element.id} selected={selected} onSelect={onSelect} onDelete={onDelete} animationKey={animationKey} preview={preview} />;
    case BUTTON_ELEMENT:
      return <ButtonElement elementId={element.id}  zIndex={zIndex} selected={selected} onSelect={onSelect} onDelete={onDelete } animationKey={animationKey} preview={preview} />;
    case IMAGE_ELEMENT:
      return <ImageElement elementId={element.id}  zIndex={zIndex} selected={selected} onSelect={onSelect} onDelete={onDelete} animationKey={animationKey} preview={preview} />;
    case TEXT_ELEMENT:
      return <TextElement elementId={element.id}  zIndex={zIndex} selected={selected} onSelect={onSelect} onDelete={onDelete} animationKey={animationKey} preview={preview} />;
    case CUSTOM_HTML_ELEMENT:
      return <CustomHtmlElement elementId={element.id} selected={selected} onSelect={onSelect} onDelete={onDelete} animationKey={animationKey} preview={preview} />;
    case FORM_ELEMENT:
      return <FormElement elementId={element.id}  zIndex={zIndex} selected={selected} onSelect={onSelect} onDelete={onDelete} animationKey={animationKey} preview={preview} />;
    case TRIGGER_ELEMENT :
      return <TriggerElement elementId={element.id}  />
    default :
      return null;
  }
};
ElementContainer.propTypes = _props;
export default ElementContainer;