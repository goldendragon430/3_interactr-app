import {nodePath} from "../node/routes";
import {interactionPath} from "../interaction/routes";


export function elementGroupPath({elementGroupId}) {
  return nodePath(...arguments) + `/element-group/${elementGroupId}`;
}

export function elementPath({interactionId}) {
  return interactionPath(...arguments) + `/element`;
}

export function elementModalEditPath({modalElementId}) {
  return interactionPath(...arguments) + `/element/${modalElementId}`;
}

