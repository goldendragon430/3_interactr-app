import React, { useContext } from "react";

import FacebookEventToggle from "modules/facebookEvent/components/FacebookEventToggle";
import { useSaveInteraction } from "@/graphql/Interaction/hooks";
import ErrorMessage from "components/ErrorMessage";
import { NodeContext } from "modules/node/context";
import { useElementRoute } from "modules/element/routeHooks";

/**
 * Abstraction of the interaction implementation of the facebook toggle to make
 * the code cleaner. This can seem a little messy but its for a reason. At this
 * stage the interactions on the node editor all work from the NodeContext. However
 * because object is getting created here what we don't want to happen is the new object
 * is created then the page refreshed and the link between the new object and the interaction
 * lost,
 * To solve this we update the context as normal but also update the BE at the same time to ensure
 * everything is kept in sync.
 * @param interaction
 * @param updateContext
 * @returns {*}
 * @constructor
 */
export const InteractionFacebookToggle = () => {
  const [updateInteraction, {error}] = useSaveInteraction();
  const context = useContext(NodeContext);
  const [activeInteraction] = useElementRoute();
  const interaction = context.interactions[ parseInt(activeInteraction) ];

  const updateContext = (key, value)=>{
    context.updateInteraction({
      interactionId: activeInteraction,
      key,
      value
    });
  };

  if(!interaction) return null;

  const {send_facebook_view_event, facebook_view_event_id} = interaction;

  if(error){
    return <ErrorMessage error={error} />
  }

  return(
    <FacebookEventToggle
      label="Send Event to Facebook When This Element is shown"
      onChangeShouldSendEvent={ async (val) =>{
        // See notes at top of page as to why we do this
        updateContext("send_facebook_view_event", val);
        return updateInteraction({
          id: interaction.id,
          "send_facebook_view_event": val
        })
      }}
      onChangeEventId={ async (val) =>{
        // See notes at top of page as to why we do this
        updateContext("facebook_view_event_id", val);
        return updateInteraction({
          id: interaction.id,
          "facebook_view_event_id": val
        })
      }}
      shouldSendEvent={send_facebook_view_event}
      eventId={facebook_view_event_id}
    />
  );
};