import {useInteractionRoute} from "modules/interaction/routeHooks";
import {useModalElementRoute} from "modules/modal/routeHooks";
import {useElementRoute} from "modules/element/routeHooks";
import {createMutationHook, createQueryHook} from "../utils";
import {GET_FORM_ELEMENT} from "../FormElement/queries";
import {
  BUTTON_ELEMENT,
  CUSTOM_HTML_ELEMENT, FORM_ELEMENT,
  HOTSPOT_ELEMENT, IMAGE_ELEMENT,
  TEXT_ELEMENT,
  TRIGGER_ELEMENT
} from "../../modules/element/elements";
import {GET_BUTTON_ELEMENT} from "../ButtonElement/queries";
import {GET_HOTSPOT_ELEMENT} from "../HotspotElement/queries";
import {GET_TEXT_ELEMENT} from "../TextElement/queries";
import {GET_CUSTOM_HTML_ELEMENT} from "../CustomHtmlElement/queries";
import {GET_IMAGE_ELEMENT} from "../ImageElement/queries";
import {GET_TRIGGER_ELEMENT} from "../TriggerElement/queries";
import {GET_INTERACTION} from "../Interaction/queries";
import {GET_MODAL_ELEMENT} from "../Modal/queries";
import client from "../client";
import {useEffect, useState} from "react";
import analytics from "../../utils/analytics";
import {CREATE_FORM_ELEMENT} from "../FormElement/mutations";
import {CREATE_BUTTON_ELEMENT} from "../ButtonElement/mutations";
import {CREATE_HOTSPOT_ELEMENT} from "../HotspotElement/mutations";
import {CREATE_TEXT_ELEMENT} from "../TextElement/mutations";
import {CREATE_HTML_ELEMENT} from "../CustomHtmlElement/mutations";
import {CREATE_IMAGE_ELEMENT} from "../ImageElement/mutations";
import {CREATE_TRIGGER_ELEMENT} from "../TriggerElement/mutations";

export const useElement = (type, id) => createQueryHook({
  typename: getTypename(type),
  query: getQuery(type),
  variables:{id}
});

export const useCreateElement = (type) => createMutationHook({
  mutation: getMutation(type)
});

/**
 * So hooks make this VERY hard. Simply put all we can return here is the element_id and
 * element_type. In your component you will need to call this hook then in ANOTHER COMPONENT
 * call the useElement hook. This is because all hooks must be called at the top of the
 * component and we can;t call useElement until we have the data.
 * @returns {{element_id: null, element_type: null, loading: boolean, error: ApolloError}}
 */
export const useGetActiveElementMeta = () => {
  const [elementId] = useElementRoute();
  const [modalElementId] = useModalElementRoute();
  const [interactionId] = useInteractionRoute();

  // The element id here is actually interaction id as the element
  // id's arent unqiue. We just refer to it as elementID when the element
  // is active in the UI
  const query = (elementId || interactionId) ? GET_INTERACTION : GET_MODAL_ELEMENT;
  const typename = (elementId || interactionId) ? 'Interaction' : 'ModalElement';
  const variables = {
    id: elementId || interactionId || modalElementId
  };

  const [parent, _, {loading, error}] = createQueryHook({
    query, typename, variables
  });

  const element_id = (parent) ? parent.element_id : null;
  const element_type = (parent) ? parent.element_type : null;

  return {element_id, element_type, loading, error};
};


function getTypename(type) {
  switch(type) {
    case(FORM_ELEMENT) :
      return 'FormElement';
    case(BUTTON_ELEMENT) :
      return 'ButtonElement';
    case(HOTSPOT_ELEMENT) :
      return 'HotspotElement';
    case(TEXT_ELEMENT) :
      return 'TextElement';
    case(CUSTOM_HTML_ELEMENT) :
      return 'CustomHtmlElement';
    case(IMAGE_ELEMENT) :
      return 'ImageElement';
    case(TRIGGER_ELEMENT) :
      return 'TriggerElement';
  }
};

function getQuery(type) {
  switch(type) {
    case(FORM_ELEMENT) :
      return GET_FORM_ELEMENT;
    case(BUTTON_ELEMENT) :
      return GET_BUTTON_ELEMENT;
    case(HOTSPOT_ELEMENT) :
      return GET_HOTSPOT_ELEMENT;
    case(TEXT_ELEMENT) :
      return GET_TEXT_ELEMENT;
    case(CUSTOM_HTML_ELEMENT) :
      return GET_CUSTOM_HTML_ELEMENT;
    case(IMAGE_ELEMENT) :
      return GET_IMAGE_ELEMENT;
    case(TRIGGER_ELEMENT) :
      return GET_TRIGGER_ELEMENT;
  }
};

function getMutation(type) {
  switch(type) {
    case(FORM_ELEMENT) :
      return CREATE_FORM_ELEMENT;
    case(BUTTON_ELEMENT) :
      return CREATE_BUTTON_ELEMENT;
    case(HOTSPOT_ELEMENT) :
      return CREATE_HOTSPOT_ELEMENT;
    case(TEXT_ELEMENT) :
      return CREATE_TEXT_ELEMENT;
    case(CUSTOM_HTML_ELEMENT) :
      return CREATE_HTML_ELEMENT;
    case(IMAGE_ELEMENT) :
      return CREATE_IMAGE_ELEMENT;
    case(TRIGGER_ELEMENT) :
      return CREATE_TRIGGER_ELEMENT;
    default :
      return CREATE_TEXT_ELEMENT;
  }
}