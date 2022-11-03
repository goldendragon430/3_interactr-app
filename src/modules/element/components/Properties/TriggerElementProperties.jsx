import React from 'react';
import {elements, TRIGGER_ELEMENT} from "../../elements";
import ElementPropertiesTabs from "../ElementPropertiesTabs";
import {useButtonElementCommands} from "../../../../graphql/ButtonElement/hooks";
import {useTriggerElementCommands} from "../../../../graphql/TriggerElement/hooks";


const TriggerElementProperties = ({element}) => {
  const {updateTriggerElement} = useTriggerElementCommands(element.id);

  const elementMeta = elements[TRIGGER_ELEMENT];

  return <ElementPropertiesTabs
    meta={elementMeta}
    element={element}
    update={updateTriggerElement}
    startTab={'clickable'}
  />
};
export default TriggerElementProperties;