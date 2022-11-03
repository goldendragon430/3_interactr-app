import {makeVar} from "@apollo/client";

/**
 * Project Preview is used lots of times around the app so to
 * make this easier we have a global preview component. We
 * just need to se the project ID here that we want to preview
 * @type {ReactiveVar<boolean>}
 */
export const getPreviewProject = makeVar({
  projectId: false,
  startNodeId: false,
  templateId: false
});
export const setPreviewProject = getPreviewProject;