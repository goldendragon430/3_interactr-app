import PositionableElement from "./PositionableElement";
import React, {useState} from "react";
import PropTypes from "prop-types";
import EditableText from "../../../../components/EditableText";
import Element from "./Element";
import DraggableResizable from "../../../../components/DraggableResizable";

/**
 * Required props for the component
 * @type {{id: *}}
 * @private
 */
const _props = {
  // the element object
  element: PropTypes.isRequired,
  // The update method of the element
  update: PropTypes.func.isRequired,
  // The ID of the interaction needed for routing
  interaction_id: PropTypes.isRequired,
  // Formatted css styles for the element
  style: PropTypes.isRequired,
  // Prevent the element from being resized
  disableResize: PropTypes.bool,
  // The height of the element
  height: PropTypes.isRequired,
  // The width of the element
  width: PropTypes.isRequired,
  // Is this element positionable or not
  positionable: PropTypes.isRequired
};

/**
 * Used to make the text content of an element editable
 * @returns {*}
 * @constructor
 */
const EditableTextContainer = ({element, update, style, disableResize=false, width, height, positionable, save, onSelect, selected, onDelete, animationKey, projectFont, preview=false, vResizeDisabled=false}) => {
  const {html, borderRadius, padding, paddingLeft, paddingRight, animation, id } = element;
  const [editing, setEditing] = useState(false);
  
  let styles = {
    ...style,
    cursor: editing ? 'auto' : 'pointer',
    width: positionable ? '100%' : width ,
    borderRadius,
    paddingLeft: (paddingLeft) ? paddingLeft : padding + '%',
    paddingRight: (paddingRight) ? paddingRight : padding + '%',
  };

  if(projectFont) {
    styles.fontFamily = `${projectFont}`
  }

  if (positionable) {
    styles = {
      ...styles,
      position: 'absolute',
      height: positionable ? '100%' : height,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
    }; 
  }

  const contents = (
    <EditableText
      editing={editing}
      value={html}
      projectFont={projectFont}
      selected={selected}
      className="reset_children_font"
      onStartEdit={()=>setEditing(true)}
      onStopEdit={()=>setEditing(false)}
      update={update}
      vResizeDisabled={vResizeDisabled}
      preview={preview}
      onDelete={onDelete}
    />
  );
  
  if(disableResize) return contents;
  
  return (
    <PositionableElement
      disabled={editing || !positionable}
      element={element}
      update={update}
      save={save}
      style={styles}
      selected={selected}
      onSelect={onSelect}
      onDelete={onDelete}
      animationKey={animationKey}
      editing={editing}
      preview={preview}
    >
      {contents}
    </PositionableElement>
  );
};
EditableTextContainer.propType = _props;
EditableTextContainer.defaultProps = {
  positionable: true,
}
export default EditableTextContainer;