import { makeVar } from "@apollo/client";

export const SHOW_NODE_SETTINGS_MODAL = "SHOW_NODE_SETTINGS_MODAL";

export const SHOW_CHANGE_SOURCE_MEDIA_MODAL = "SHOW_CHANGE_SOURCE_MEDIA_MODAL";

export const SHOW_NODE_BACKGROUND_COLOR_MODAL = "SHOW_NODE_BACKGROUND_COLOR_MODAL";

export const NODE_SETTING_VAR_INITIAL_DATA = {
  activeModal: ""
}

export const getNodeSettings = makeVar(NODE_SETTING_VAR_INITIAL_DATA);

export const setNodeSettings = (newData) => {
  const oldData = getNodeSettings();
  const data = { ...oldData, ...newData };
  getNodeSettings(data);
}