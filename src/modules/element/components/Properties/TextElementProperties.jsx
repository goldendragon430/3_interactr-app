import React from 'react';
import {TEXT_ELEMENT, elements} from "../../elements";
import ElementPropertiesTabs from "../ElementPropertiesTabs";
import {useTextElementCommands} from "../../../../graphql/TextElement/hooks";


const TextElementProperties = ({element}) => {
  const {updateTextElement} = useTextElementCommands(element.id);

  const elementMeta = elements[TEXT_ELEMENT];

  return <ElementPropertiesTabs meta={elementMeta} element={element} update={updateTextElement} />;
};
export default TextElementProperties;