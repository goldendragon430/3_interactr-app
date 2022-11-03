import {nodePath} from "../node/routes";


export function interactionPath({interactionId}) {
  return nodePath(...arguments) + `/interaction/${interactionId}`;
}
