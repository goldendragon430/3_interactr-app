import {
  BUTTON_ELEMENT, FORM_ELEMENT, getElementMeta, getPrefixedProps, getStyles
} from 'modules/element/elements';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { SAVE_NODE_PAGE } from 'utils/EventEmitter';
import { randomString } from 'utils/textUtils';
import { cache } from "../../../../graphql/client";
import { FORM_ELEMENT_FRAGMENTS } from "../../../../graphql/FormElement/fragments";
import { useFormElementCommands } from "../../../../graphql/FormElement/hooks";
import EditableTextContainer from "./EditableTextContainer";
import PositionableElement from './PositionableElement';

export default function FormElement({animationKey, elementId, selected, onSelect, onDelete, preview, projectFont}) {
  const [editing, setEditing] = useState(false);
  const {updateFormElement} = useFormElementCommands(elementId)

  const element = cache.readFragment({
    id: `FormElement:${elementId}`,
    fragment: FORM_ELEMENT_FRAGMENTS
  });
  
  const className = randomString(6);
  const {
    show_name_field,
    on_one_line,
    padding,
    backgroundColour,
    borderRadius,
    button_paddingSides,
    name_placeholder_text,
    email_placeholder_text,
    button_text_color,
    border_color,
    border_width,
    border_type
  } = element;
  
  const toggleEditState = state => () => {
    setEditing(state);
  };

  const changeHandler = prefix => (property, value) => {
    const key = prefix + property;
    updateFormElement(key, value);
    const eventName = SAVE_NODE_PAGE;

    const event = new CustomEvent(eventName, {
      detail: {
        __typename: "FormElement",
        id: elementId,
        [key]: value
      },
    });
    window.dispatchEvent(event);
  };

  function renderInput({ placeholder, className }) {
    const { on_one_line, input_color, input_borderType, input_borderWidth } = element;
    let styles = { ...getElementMeta(FORM_ELEMENT).inputStyles, ...getPrefixedProps(element, 'input_') };
    // appendPlaceholderColorToDom(input_color, className);

    if (on_one_line) {
      styles.marginRight = getElementMeta(FORM_ELEMENT).elementSpacing + 'px';
      styles.marginBottom = 0;
      styles.flexGrow = 1;
    } else {
      styles.marginBottom = getElementMeta(FORM_ELEMENT).elementSpacing + 'px';
      styles.flexGrow = 0;
    }
    styles.height = '40px';
    styles.borderStyle = input_borderType;
    styles.borderWidth = input_borderWidth + 'px';
    styles.fontFamily = projectFont;

    return <input type="text" style={styles} placeholder={placeholder} className={className} onKeyDown={(e) => {e.stopPropagation();}}/>;
  }

  const wrapperStyles = {
    flexDirection: on_one_line ? 'row' : 'column',
    display: 'flex',
    alignItems: 'stretch',
    justifyContent: 'center',
    height: '100%',
    paddingLeft: padding + 'px',
    paddingRight: padding + 'px',
    backgroundColor: backgroundColour,
    borderRadius: borderRadius,
    borderStyle: border_type,
    borderWidth: border_width + 'px',
    borderColor: border_color
  };
  
  const renderForm = () => (
    <div style={wrapperStyles}>
      {!!show_name_field && renderInput({ placeholder: name_placeholder_text, className })}
      {renderInput({ placeholder: email_placeholder_text, className })}
      <div style={{
          ...getStyles(BUTTON_ELEMENT, getPrefixedProps(element, 'button_')),
          ...{
            width: 'fit-content',
            height: '40px',
            // flex: '0 1 0%',
            paddingLeft: button_paddingSides + 'px',
            paddingRight: button_paddingSides + 'px',
          },
      }}>
        <EditableTextContainer
          update={changeHandler('button_')}
          // update={updateFormElement} 
          //height={getElementMeta(FORM_ELEMENT).buttonHeight}
          selected={selected}
          positionable={false}
          disableResize={true} // disables resizing of the button
          vResizeDisabled={true}
          onDelete={onDelete}
          element={getPrefixedProps(element, 'button_')}
          preview={preview}
          projectFont={projectFont}
        />
      </div>
    </div>
  );

  return (
    <PositionableElement 
      disabled={editing} 
      element={element}  
      update={updateFormElement} 
      onSelect={onSelect} 
      selected={selected} 
      onDelete={onDelete}
      vResizeDisabled={true}
      animationKey={animationKey}
    >
      {renderForm()}
    </PositionableElement>
  );
}
