import React, {useContext, useState} from 'react';
import {
  Section,
  Option,
  RangeInput,
} from 'components/PropertyEditor';
import {TextInput} from "components/PropertyEditor/PropertyEditor";
import PropTypes from "prop-types";
import ClickableElementProperties from "./ClickableElementProperties";
import {NodeContext} from "../../../node/context";
import {useInteractionRoute} from "../../../interaction/routeHooks";
import {useElementRoute} from "../../routeHooks";
import {motion} from "framer-motion";
import {useSetState} from "../../../../utils/hooks";
import {useQuery} from "@apollo/client";
import {GET_MEDIAS} from "../../../../graphql/Media/queries";
import gql from "graphql-tag";
import {useParams} from "react-router-dom";
import Icon from "../../../../components/Icon";
import {useButtonElementCommands} from "../../../../graphql/ButtonElement/hooks";
import Slider from "rc-slider";
import styles from "../../../../components/PropertyEditor/PropertyEditor.module.scss";

/**
 * Validate the inputs for the component
 * @type {{update: (shim|(function(*, *, *, *, *, *): (undefined))), loading: {new(...args: A): R} | ((...args: A) => R) | OmitThisParameter<T> | T | any | {new(...args: AX[]): R} | ((...args: AX[]) => R), element}}
 * @private
 */
// const _props = {
//   element: PropTypes.shape({
//     action: PropTypes.string,
//     actionArg: PropTypes.any
//   }),
//   update: PropTypes.func.isRequired,
// };

/**
 * The editable properties of an element that can be moved on
 * the canvas
 * @param element
 * @param update
 * @param loading
 * @returns {*}
 * @constructor
 */
const PositionableElementProperties = ({tabAnimation, element, update}) => {

    return (
      <motion.div {...tabAnimation}>
        <Section>
          <Name value={element.name} update={update} />
          {
            (element.__typename!=='TriggerElement' && <>
              <PosY value={element.posY} maxValue={405 - element.height} update={update} />
              <PosX value={element.posX} maxValue={720 - element.width} update={update} />
              <Height value={element.height} maxValue={405 - element.posY} update={update} />
              <Width value={element.width} maxValue={720 - element.posX} update={update} />
            </>)
          }
        </Section>
      </motion.div>
    );
};
//PositionableElementProperties.propTypes = _props;
export default PositionableElementProperties;

const Name = ({value, update}) => {
  const [val, setVal] = useState(value);

  return (
    <Option
      label="Name"
      value={val}
      Component={TextInput}
      onChange={val=>setVal(val)}
      onBlur={val=>update("name", val)}
    />
  )
};

const PosX = ({value, maxValue, update}) => {
  const [val, setVal] = useState(value);

  return(
    <Option
      label="Horizontal Position (px)"
      value={val}
      Component={RangeInput}
      onAfterChange={val=>update("posX", val)}
      onChange={val=>{ setVal(val); update("posX", val) }}
      max={maxValue}
    />
  )
};

const PosY = ({value, maxValue, update}) => {
  const [val, setVal] = useState(value);

  return(
    <Option
      label="Vertical Position (px)"
      value={val}
      Component={RangeInput}
      onAfterChange={val=>update("posY", val)}
      onChange={val=>{ setVal(val); update("posY", val); }}
      max={maxValue}
    />
  )
};

const Height = ({value, maxValue, update}) => {
  const [val, setVal] = useState(value);

  return(
    <Option
      label="Height (px)"
      value={val}
      Component={RangeInput}
      onAfterChange={val=>update("height", val)}
      onChange={val=>{ setVal(val); update("height", val);}}
      max={maxValue}
    />
  )
};

const Width = ({value, maxValue, update}) => {
  const [val, setVal] = useState(value);

  return(
    <Option
      label="Width (px)"
      value={val}
      Component={RangeInput}
      onAfterChange={val=>update("width", val)}
      onChange={val=>{ setVal(val); update("width", val);}}
      max={maxValue}
    />
  )
};