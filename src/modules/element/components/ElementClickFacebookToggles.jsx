import React from 'react';
import { useSaveButtonElement } from "../../../graphql/ButtonElement/hooks";
import { useSaveFormElement } from "../../../graphql/FormElement/hooks";
import { useSaveHotspotElement } from "../../../graphql/HotspotElement/hooks";
import { useSaveImageElement } from "../../../graphql/ImageElement/hooks";
import ElementFacebookToggle from "./ElementFacebookToggle";

/**
 * Wraps around the element click facebook toggle so we can
 * import the db update hook
 * @param element
 * @param updateContext
 * @returns {*}
 * @constructor
 */
export const ButtonElementClickFacebookToggle = ({element, updateContext}) => {
  const [updateButtonElement, {error}] = useSaveButtonElement();

  return <ElementClickFacebookToggle
    save={updateButtonElement}
    updateContext={updateContext}
    element={element}
    error={error}
  />
};
export const ImageElementClickFacebookToggle = ({element, updateContext}) => {
  const [updateImageElement, {error}] = useSaveImageElement();

  return <ElementClickFacebookToggle
    save={updateImageElement}
    updateContext={updateContext}
    element={element}
    error={error}
  />
};
export const HotspotElementClickFacebookToggle = ({element, updateContext}) => {
  const [updateHotspotElement, {error}] = useSaveHotspotElement();

  return <ElementClickFacebookToggle
    save={updateHotspotElement}
    updateContext={updateContext}
    element={element}
    error={error}
  />
};

export const FormSubmitFacebookToggle = ({element, updateContext}) => {
  const [updateFormElement, {error}] = useSaveFormElement();

  return <ElementClickFacebookToggle
    save={updateFormElement}
    updateContext={updateContext}
    element={element}
    error={error}
    label={"Send event to facebook when this form is submitted"}
    idKey="facebook_onSubmit_event_id"
    toggleKey="send_facebook_onSubmit_event"
  />
}

/**
 * Used by the 3 components above to create a reusable toggle where we always
 * save this change to DB on change so the event id can't disapear on page
 * reload
 * @param save
 * @param updateContext
 * @param element
 * @param error
 * @param label
 * @param toggleKey
 * @param idKey
 * @returns {*}
 * @constructor
 */
const ElementClickFacebookToggle = ({save, updateContext, element, error, label, toggleKey = 'send_facebook_click_event', idKey = 'facebook_click_event_id'}) => {
  return <ElementFacebookToggle
    toggleKey={toggleKey}
    idKey={idKey}
    element={element}
    save={save}
    updateContext={updateContext}
    error={error}
    label={label}
  />
};