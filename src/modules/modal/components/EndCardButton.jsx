import {useNode} from "../../../graphql/Node/hooks";
import Icon from "../../../components/Icon";
import ErrorMessage from "../../../components/ErrorMessage";
import {useModalRoute} from "modules/modal/routeHooks";
import {useInteraction} from "../../../graphql/Interaction/hooks";
import Button from "../../../components/Buttons/Button";
import {useModal} from "../../../graphql/Modal/hooks";
import {useTriggerElement} from "../../../graphql/TriggerElement/hooks";
import React from 'react';

/**
 * First we need to load in the node to get the interaction layer id (interaction id)
 * @returns {*}
 * @constructor
 */
const EndCardButton = () => {
  const [node, updateNode, {loading, error}] = useNode();

  if(loading) return <Icon loading />;

  if(error) return <ErrorMessage error={error} />;

  const {enable_interaction_layer, interaction_layer_id} = node;

  return <EndButtonButtonGetInteraction
    interactionId={interaction_layer_id}
    enbaled={enable_interaction_layer}
  />;
};
export default EndCardButton;

/**
 * Now we need to load in the interaction so we can get the interaction so we can
 * get the trigger element id
 * @param interactionId
 * @param enabled
 * @returns {*}
 * @constructor
 */
const EndButtonButtonGetInteraction= ({interactionId, enabled}) => {
  const [interaction, __, {loading, error}] = useInteraction(interactionId);

  if(loading) return <Icon loading />;

  if(error) return <ErrorMessage error={error} />;

  return <EndCardButtonGetElement elementId={interaction.element_id} enabled={enabled} />;
};

/**
 * Now we have the interaction we can get the trigger element
 * @constructor
 */
const EndCardButtonGetElement = ({elementId, enabled}) => {
  const [element, _, {loading, error}] = useTriggerElement(elementId);

  if(loading) return <Icon loading />;

  if(error) return <ErrorMessage error={error} />;

  return <EndCardButtonGetModal modalId={element.actionArg} enabled={enabled} />;
};

/**
 * Get the modal id
 * @param modalId
 * @param enabled
 * @returns {*}
 * @constructor
 */
const EndCardButtonGetModal = ({modalId, enabled}) => {
  const {goToModalPage}  = useModalRoute();
  const [modal, __, {loading, error}] = useModal(modalId);

  let text = "End Card (";
  text += (enabled) ? 'on' : 'off';
  text += ')';

  return <Button
    primary={enabled}
    default={!enabled}
    onClick={()=>goToModalPage(modal.id)}
    small
    style={{margin:  0}}
  >
    <Icon name="bullseye-pointer"/>{text}
  </Button>
};