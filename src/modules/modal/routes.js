
import {projectPath} from "../project/routes";

export function modalPath({modalId}) {
  return projectPath(...arguments) + `/popups/${modalId}`;
}

export function modalElementPath({modalElementId}) {
  return modalPath(...arguments) + `/elements/${modalElementId}`;
}

export function modalsPath(){
  return projectPath(...arguments) + `/popups`
}