import React from 'react';
import PositionableElement from './PositionableElement';
import PropTypes from "prop-types";
import Icon from "../../../../components/Icon";
import {useHotspotElement, useHotspotElementCommands} from "../../../../graphql/HotspotElement/hooks";
import {useQuery, useReactiveVar} from "@apollo/client";
import gql from "graphql-tag";
import Element from "./Element";
import ClickThrough from "../ClickThrough";
import StaticElement from "../StaticElement";
import {playerVar} from "../../../../graphql/LocalState/player";
import {cache} from "../../../../graphql/client";
import {BUTTON_ELEMENT_FRAGMENT} from "../../../../graphql/ButtonElement/fragments";
import {TEXT_ELEMENT_FRAGMENT} from "../../../../graphql/TextElement/fragments";
import {HOTSPOT_ELEMENT_FRAGMENT} from "../../../../graphql/HotspotElement/fragments";


const PLAYER_QUERY = gql`
    query player {
        player @client {
            clickThruMode
        }
    }
`;
const HotspotElement = ({elementId, selected, onSelect, onDelete, animationKey, preview}) => {
  const {updateHotspotElement, saveHotspotElement} = useHotspotElementCommands(elementId);

  const element = cache.readFragment({
    id: `HotspotElement:${elementId}`,
    fragment: HOTSPOT_ELEMENT_FRAGMENT
  });

  const player = useReactiveVar(playerVar);

  const {clickThruMode} = player;

  if(clickThruMode) {
    return (
      <ClickThrough element={element}>
        <StaticElement
          element={element}
          animationKey={animationKey}
         />
      </ClickThrough>
    )
  }

  if(preview) {
    // Hotspots have no visual UI so no point rendering these if previewing
    return null
  }

  return (
    <PositionableElement
      element={element}
      update={updateHotspotElement}
      save={saveHotspotElement}
      selected={selected}
      onSelect={onSelect}
      onDelete={onDelete}
      animationKey={animationKey}
      disableEditable={preview}
      style={{
        height:'100%',
        boxShadow:
          '1px 1px 10px rgba(255,255,255, 0.2), 1px 1px 10px rgba(0,0,0,0.2)'
      }}
    />
  );
};
export default HotspotElement;