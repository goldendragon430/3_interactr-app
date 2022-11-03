import React from 'react';
import PositionableElementProperties from './PositionableElementProperties';
import {Section, Option, LargeTextInput, BooleanInput} from 'components/PropertyEditor';
import {useCustomHtmlElementCommands} from "../../../../graphql/CustomHtmlElement/hooks";
import ElementPropertiesTabs from "../ElementPropertiesTabs";
import {CUSTOM_HTML_ELEMENT, elements} from "../../elements";


const CustomHtmlElementProperties = ({element}) => {
  const {updateCustomHtmlElement} = useCustomHtmlElementCommands(element.id);

  const elementMeta = elements[CUSTOM_HTML_ELEMENT];

  return <ElementPropertiesTabs
    meta={elementMeta}
    element={element}
    update={updateCustomHtmlElement}
  />
};
export default CustomHtmlElementProperties;
