import React, {useState} from 'react';
import {
  Section,
  Option,
  ColorInput,
  SelectInput
} from 'components/PropertyEditor';
import RangeInputAfterChange from '../../../../components/Form/RangeInputAfterChange';
import PropTypes from "prop-types";
import {notUndefined} from "../../../../utils/helpers";
import {motion} from "framer-motion";

/**
 * Validate the inputs for the component
 * @type {{update: (shim|(function(*, *, *, *, *, *): (undefined))), loading: {new(...args: A): R} | ((...args: A) => R) | OmitThisParameter<T> | T | any | {new(...args: AX[]): R} | ((...args: AX[]) => R), element}}
 * @private
 */
const _props = {
  element: PropTypes.shape({
    action: PropTypes.string.isRequired,
    actionArg: PropTypes.any
  }),
  update: PropTypes.func.isRequired
};

/**
 *
 * @param element
 * @param update
 * @param loading
 * @param stackOrder
 * @returns {*}
 * @constructor
 */
const StyleableElementProperties = ({element, update, loading, stackOrder = 0, tabAnimation}) => {
    if(! element) return null;

    return(
      <motion.div {...tabAnimation}>
        {(element.__typename==='FormElement') ?
          <FormElementStyles
            element={element}
            update={update}
          /> :
          <ElementStyles
            element={element}
            update={update}
            stackOrder={stackOrder}
          />}
      </motion.div>
    );
};
StyleableElementProperties.propTypes = _props;
export default StyleableElementProperties;

const ElementStyles = ({element, update, stackOrder}) => {
  const {background, borderRadius, color, paddingSides, letterSpacing, borderType, borderWidth, borderColor} = element;

  const stackOrderText = stackOrder + 5;
  const stackOrderBackground = stackOrder + 4;
  const stackOrderBorderColor = stackOrder + 3;

  return (
    <Section >
      {
        notUndefined(background) && <Option
          label="Background Color"
          value={background}
          Component={ColorInput}
          onChange={val=>update("background", val)}
          stackOrder={stackOrderBackground}
        />
      }
      {
        notUndefined(color) && <Option
          label="Text Color"
          value={color}
          Component={ColorInput}
          onChange={val=>update("color", val)}
          stackOrder={stackOrderText}
        />
      }
      {
        notUndefined(paddingSides) &&
        <RangeInputAfterChange
          label="Padding (px)"
          value={paddingSides}
          update={val => update('paddingSides', val)}
          max={40}
        />
      }
      {
        notUndefined(letterSpacing) &&
        <RangeInputAfterChange
          label="Letter Spacing (px)"
          value={letterSpacing}
          update={val=>update("letterSpacing", val)}
          max={10}
        />
      }
      {
        notUndefined(borderRadius) &&
        <RangeInputAfterChange
          label="Roundness (px)"
          value={borderRadius}
          update={val=>update("borderRadius", val)}
          max={100}
        />
      }
      <BorderSelect
        borderColor={borderColor}
        borderType={borderType}
        borderWidth={borderWidth}
        updateBorderColor={(val)=>update("borderColor", val)}
        updateBorderType={(val)=>update("borderType", val)}
        updateBorderWidth={(val)=>update("borderWidth", val)}
      />
    </Section>
  )
};

const FormElementStyles = ({element, update}) => {
  return(
    <>
      <FormStyles element={element} update={update} />
      <InputStyles element={element} update={update} />
      <ButtonStyles element={element} update={update} />
    </>
  )
}

const FormStyles = ({element, update}) => {
  const {backgroundColour, borderRadius, padding, border_color,  border_type, border_width} = element;

  return(
    <Section title="Form Styles">
      <div style={{ position: 'relative', zIndex: 100 }}>
        <Option
        label="Background Color"
        value={backgroundColour}
        Component={ColorInput}
        onChange={val => update('backgroundColour', val)}
        />
      </div>
      <RangeInputAfterChange
        label="Roundness (px)"
        value={borderRadius}
        update={val=>update("borderRadius", val)}
        max={100}
      />
      <RangeInputAfterChange
        label="Padding (px)"
        value={padding}
        update={val=>update("padding", val)}
        max={100}
      />
      <BorderSelect
        borderColor={border_color}
        borderType={border_type}
        borderWidth={border_width}
        updateBorderColor={(val)=>update("border_color", val)}
        updateBorderType={(val)=>update("border_type", val)}
        updateBorderWidth={(val)=>update("border_width", val)}
      />
    </Section>
  )
};


const InputStyles = ({element, update}) =>{
  const {input_background, input_color, input_borderRadius, input_borderWidth, input_borderColor, input_borderType} = element;

  return(
    <Section title="Form Input Styles">
      <div style={{ position: 'relative', zIndex: 100 }}>
        <Option
        label="Background Color"
        value={input_background}
        Component={ColorInput}
        onChange={val => update('input_background', val)}
        />
      </div>
      <div style={{ position: 'relative', zIndex: 90 }}>
        <Option
        label="Text Color"
        value={input_color}
        Component={ColorInput}
        onChange={val => update('input_color', val)}
        />
      </div>
      <RangeInputAfterChange value={input_borderRadius} update={val => update('input_borderRadius', val)} />
      <BorderSelect
        borderColor={input_borderColor}
        borderType={input_borderType}
        borderWidth={input_borderWidth}
        updateBorderColor={(val)=>update("input_borderColor", val)}
        updateBorderType={(val)=>update("input_borderType", val)}
        updateBorderWidth={(val)=>update("input_borderWidth", val)}
      />
    </Section>
  )
}

const ButtonStyles =  ({element, update}) => {
  const {button_background, button_text_color, button_borderRadius, button_paddingSides, button_letterSpacing, button_borderColor, button_borderType, button_borderWidth} = element;

  return(
    <Section title="Submit Button Styles">
      <div style={{ position: 'relative', zIndex: 100 }}>
        <Option
          label="Background Color"
          value={button_background}
          Component={ColorInput}
          onChange={val => update('button_background', val)}
        />
      </div>
      {/* <div style={{ position: 'relative', zIndex: 90 }}>
        <Option
          label="Text Color"
          value={button_text_color}
          Component={ColorInput}
          onChange={val => update('button_text_color', val)}
        />
      </div> */}

      <RangeInputAfterChange
        label="Roundness (px)"
        value={button_borderRadius}
        update={val => update('button_borderRadius', val)}
      />

      <RangeInputAfterChange
        label="Padding"
        value={button_paddingSides}
        update={val => update('button_paddingSides', val)}
      />
      <RangeInputAfterChange
        label="Letter Spacing (px)"
        value={button_letterSpacing}
        update={val => update('button_letterSpacing', val)}
        max={10}
      />
      <BorderSelect
        borderColor={button_borderColor}
        borderType={button_borderType}
        borderWidth={button_borderWidth}
        updateBorderColor={(val)=>update("button_borderColor", val)}
        updateBorderType={(val)=>update("button_borderType", val)}
        updateBorderWidth={(val)=>update("button_borderWidth", val)}
      />
    </Section>
  )
}


const BorderSelect = ({borderWidth, borderColor, borderType, updateBorderWidth, updateBorderColor, updateBorderType}) => {
  return(
    <>
      {
        notUndefined(borderWidth) && <>
          <RangeInputAfterChange
            label="Border width (px)"
            value={borderWidth}
            update={val=>updateBorderWidth(val)}
            max={10}
          />
          {
            (borderWidth > 0) && <>
              <Option
                label="Border Color"
                value={borderColor}
                Component={ColorInput}
                onChange={val=>updateBorderColor(val)}
                stackOrder={10}
              />
              <Option
                label="Border Type"
                value={borderType}
                onChange={val=>updateBorderType(val)}
                Component={SelectInput}
                options={[
                  {label: 'Solid', value: 'solid', clearableValue: false},
                  {label: 'Dashed', value: 'dashed', clearableValue: false},
                  {label: 'Dotted', value: 'dotted', clearableValue: false}
                ]}
              />
            </>
          }
        </>
      }
    </>
  )
};