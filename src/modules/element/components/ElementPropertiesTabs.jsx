import React, {useContext, useEffect} from 'react';
import PositionableElementProperties from "./Properties/PositionableElementProperties";
import ClickableElementProperties from "./Properties/ClickableElementProperties";
import StyleableElementProperties from "./Properties/StyleableElementProperties";
import InteractionProperties from "../../interaction/components/InteractionProperties";
import {useState} from "react";
import Icon from "../../../components/Icon";
import AnimationElementProperties from "./Properties/AnimationElementProperties";
import styles from './ElementPropertiesTabs.module.scss';
import cx from 'classnames';
import uniqueId from 'lodash/uniqueId';
import ReactTooltip from "react-tooltip";
import {useModalRoute} from "modules/modal/routeHooks";
import Button from "../../../components/Buttons/Button";
import ContentLoader from "react-content-loader";
import {useElementRoute} from "../routeHooks";
import {NodeContext} from "../../node/context";
import {motion} from 'framer-motion'
import FormableElementProperties from "./Properties/FormableElementProperties";
import _map from 'lodash/map';
import ImageableElementProperties from "./Properties/ImageableElementProperties";
import {useInteractionCommands} from "../../../graphql/Interaction/hooks";
import CustomHtmlableProperties from "./Properties/CustomHtmlableProperties";
import {useParams} from 'react-router-dom';


const ElementPropertiesTabs = ({element, meta,  update, save, startTab = 'positionable'}) => {
  const [active, setActive] = useState(startTab);

  return(
    <div >
      <div style={{width: '100%', float: 'left'}}>
        <Header active={active} setActive={setActive} meta={meta} />
      </div>
      <div style={{width: '100%', float:'left', height: 'calc(100vh - 105px)', overflow: 'hidden', overflowY: 'scroll'}}>
        <ActiveTabSwitch
          active={active}
          element={element}
          update={update}
          save={save}
        />
      </div>
    </div>
  )
};
export default ElementPropertiesTabs

const Header = ({active, setActive, meta}) => {
  const {modalId} = useParams()

  if(!meta.properties) {
    console.error("Element has no properties defined in the utils/elements.js file");
    return null;
  }

  return(
    <ul className={styles.headerWrapper}>
      {_map(meta.properties, (property, index) => <PropertyHeader key={'property_header_'+index} property={property} active={active===property} onClick={setActive} />)}

      {/* We need to hide the interaction properties when on the modal route as modal elements don't have an interaction */}
      {!modalId && <PropertyHeader property={'interaction'} active={active==='interaction'} onClick={setActive} />}
    </ul>
  )
};

const ActiveTabSwitch = ({active, update, element, save}) => {
  const {modalElementId} = useParams();

  const tabAnimation = {
    animate: {y: 0, opacity: 1},
    initial: {y:25, opacity: 0},
    transition: { type: "spring", duration: 0.2, bounce: 0.5, damping: 15}
  };

  let options = {
    '': 'Do nothing',
    playNode:'Play Node',
    openUrl: 'Open Url',
    skipToTime: 'Skip To Time',
  };

  if(modalElementId) {
    options.closeModal = "Close Popup"
  }
  else {
    options.openModal = 'Open Popup'
  }
  
  switch(active) {
    case('clickable') :
      return <ClickableElementProperties
        tabAnimation={tabAnimation}
        element={element}
        update={update}
        options={options}
        actionTitle={getClickActionTitle(element.__typename)}
      />;

    case('positionable') :
      return <PositionableElementProperties
        tabAnimation={tabAnimation}
        element={element}
        update={update}
      />;

    case('styleable') :
      return <StyleableElementProperties
        tabAnimation={tabAnimation}
        element={element}
        update={update}
      />;

    case('animatable') :
      return <AnimationElementProperties
        tabAnimation={tabAnimation}
        element={element}
        update={update}
      />;

    case('formable') :
      return <FormableElementProperties
        tabAnimation={tabAnimation}
        element={element}
        update={update}
      />;

    case('interaction') :
      return <InteractionProperties
        tabAnimation={tabAnimation}
      />;

    case('imageable') :
      return <ImageableElementProperties
        tabAnimation={tabAnimation}
        element={element}
        update={update}
        save={save}
      />

    case('customhtmlable') :
      return <CustomHtmlableProperties
        tabAnimation={tabAnimation}
        element={element}
        update={update}
      />

    default :
      return null;
  }
};

const PropertyHeader = ({property, active, onClick}) => {
  const id = uniqueId();
  const icon = getIconForProperty(property);
  // Annpying quirk, have to load the icon as FAB if facebook not FAR
  const type = (icon==='facebook') ? 'fab' : 'far';

  return (
    <li className={cx(styles.headerItem, {[styles.active]: active})} onClick={()=>onClick(property)} >
      <Icon name={icon} type={type}/>
      {getNameForProperty(property)}
    </li>
  );
};

const getIconForProperty = property => {
  switch(property) {
    case('clickable') :
      return 'mouse-pointer';
    case('positionable') :
      return 'sliders-v';
    case('styleable') :
      return 'paint-brush';
    case('animatable') :
      return 'camera-movie';
    case('interaction') :
      return 'stopwatch';
    case('facebookable') :
      return 'facebook';
    case('formable') :
      return "envelope";
    case('imageable') :
      return 'image'
    case('customhtmlable') :
      return "code"

    default :
      return null;
  }
};

const getNameForProperty = property => {
  switch(property) {
    case('clickable') :
      return 'Actions';
    case('positionable') :
      return 'Properties';
    case('styleable') :
      return 'Styles';
    case('animatable') :
      return 'Animation';
    case('interaction') :
      return 'Timeline';
    case('facebookable') :
      return 'Facebook';
    case('formable') :
      return "Form";
    case('imageable') :
      return 'Image'
    case('customhtmlable') :
      return 'Html'

    default :
      return null;
  }
};


const getTooltipForProperty = property => {
  switch(property) {
    case('clickable') :
      return 'Interaction Properties';
    case('positionable') :
      return 'Element Properties';
    case('styleable') :
      return 'Style Properties';
    case('animatable') :
      return 'Animation Properties';
    case('interaction') :
      return 'Timeline Properties';

    default :
      return null;
  }
};

const getClickActionTitle = typename => {
  switch(typename) {
    case('FormElement') :
      return "What should happen when this form is submitted";
    case('TriggerElement') :
      return "Choose an action for this trigger";
    default :
      return "What should happen when this element is clicked";
  }
};

