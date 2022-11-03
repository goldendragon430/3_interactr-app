import React, {useContext} from 'react';
import PositionableElementProperties from './PositionableElementProperties';
import StyleableElementProperties from './StyleableElementProperties';
import ClickableElementProperties from './ClickableElementProperties';
import AnimationElementProperties from './AnimationElementProperties';
import ErrorMessage from "../../../../components/ErrorMessage";
import Icon from "../../../../components/Icon";
import PropTypes from "prop-types";
import InteractionProperties from "../../../interaction/components/InteractionProperties";
import {elements, BUTTON_ELEMENT} from "../../elements";
import ElementPropertiesTabs from "../ElementPropertiesTabs";
import {useButtonElement, useButtonElementCommands} from "../../../../graphql/ButtonElement/hooks";
import {ElementPropertiesLoader} from "./ElementProperties";
import {gql, useQuery} from "@apollo/client";
import {GET_BUTTON_ELEMENT} from "../../../../graphql/ButtonElement/queries";
import {INTERACTION_FRAGMENT} from "../../../../graphql/Interaction/fragments";
import {cache} from "../../../../graphql/client";
import {useElementRoute} from "../../routeHooks";
import {NodeContext} from "../../../node/context";

const _props = {
  // Id of the button element
  //id: PropTypes.isRequired
};

const ButtonElementProperties = ({element}) => {
  const {updateButtonElement} = useButtonElementCommands(element.id);
  
  const elementMeta = elements[BUTTON_ELEMENT];

  return <ElementPropertiesTabs
    meta={elementMeta}
    element={element}
    update={updateButtonElement}
    startTab={'clickable'}
  />;
};
export default ButtonElementProperties;
