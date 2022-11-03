import {projectPath} from "../project/routes";

export function nodePath({projectId, nodeId}) {
  return projectPath(...arguments) + `/nodes/${nodeId}`;
}