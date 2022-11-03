import {makeVar} from "@apollo/client";



export const getAddProject = makeVar({
  show: false,
  templateId: false
});
export const setAddProject = getAddProject;