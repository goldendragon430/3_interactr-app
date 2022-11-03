import {projectPath} from "./modules/project/routes";

export const sharePath = (projectHash = "", page) => {
  if (page) {
    return `/share/${projectHash}?page=${page}`;
  }

  return `/share/${projectHash}`;
};

// generates a Route path e.g. projects/:projectId/nodes/:nodeId
export function toRoutePath(pathBuilder, params = []) {
  const routeParams = params.reduce((routeParams, param) => {
    return {...routeParams, [param]: `:${param}`};
  }, {});

  return pathBuilder(routeParams);
}
