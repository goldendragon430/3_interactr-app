import React from 'react';
import {useQuery, useReactiveVar} from "@apollo/client";
import gql from "graphql-tag";
import ClickThrough from "../ClickThrough";
import StaticElement from "../StaticElement";
import {playerVar} from "../../../../graphql/LocalState/player";
import {cache} from "../../../../graphql/client";
import {BUTTON_ELEMENT_FRAGMENT} from "../../../../graphql/ButtonElement/fragments";
import {TRIGGER_ELEMENT_FRAGMENT} from "../../../../graphql/TriggerElement/fragments";

const PLAYER_QUERY = gql`
    query player {
        player @client {
            clickThruMode
        }
    }
`;
const TriggerElement = ({elementId}) => {
  const player = useReactiveVar(playerVar);

  const {clickThruMode} = player;

  const element = cache.readFragment({
    id: `TriggerElement:${elementId}`,
    fragment: TRIGGER_ELEMENT_FRAGMENT
  });

  if(clickThruMode) {
    return (
      <ClickThrough element={element} />
    )
  }

  return null;
}
export default TriggerElement;