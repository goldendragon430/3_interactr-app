import React from 'react';
import {elements, HOTSPOT_ELEMENT} from "../../elements";
import ElementPropertiesTabs from "../ElementPropertiesTabs";
import {useHotspotElementCommands} from "../../../../graphql/HotspotElement/hooks";

const HotspotElementProperties = ({element}) => {
  const {updateHotspotElement} = useHotspotElementCommands(element.id);

  const elementMeta = elements[HOTSPOT_ELEMENT];

  return <ElementPropertiesTabs  meta={elementMeta} element={element} update={updateHotspotElement}  startTab={'clickable'} />;
};
export default HotspotElementProperties;