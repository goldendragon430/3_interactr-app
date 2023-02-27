import Element from "./Element/Element";
import React from "react";

/**
 * Static elements are used for previewing and have
 * no editable properties
 * @constructor
 */
const StaticElement = ({children, element, animationKey, style = {}}) => {

  const _style = {...{
    height: element.height + 'px',
    width: element.width + 'px',
    left: element.posX + 'px',
    top: element.posY + 'px',
    position: 'absolute',
  }, ...style}
  
  return (
    <Element
      style={_style}
      animation={element.animation}
      element={element}
      animationKey={animationKey}
      id={element.id}
    >
      {children}
    </Element>
  )
}
export default StaticElement;