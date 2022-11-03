import {useNavigate, useParams} from "react-router-dom";
import {elementGroupPath, elementPath} from "./routes";

/**
 * Interaction with the element route. Helper to read to or write from the route. We pass in the interaction
 * id here NOT the element ID. This might seem odd but due to the polymorphic nature of elements button_element id 1
 * and hotspot_element id 1 are not the same element so we need to write the interaction ID to the route as this is
 * unique. We have element route and interaction route as two seperate things as in the UI sometimes we just want to
 * show active status on some interactions without actually opening the element toolbar. Setting the active element
 * opens the flyout toolbar.
 * @returns {[{elementId: *, projectId: *, nodeId: *}, {setElement: setElement}]}
 */
export const useElementRoute = () => {
  const {projectId, nodeId, interactionId} = useParams();
  const navigate = useNavigate();

  const setElement = interactionId => {
    navigate(elementPath( {projectId, nodeId, interactionId} ));
  };

  // Crude way todo this but not aware of an alternative in react router, in
  // vue named routes would solve this
  const id = (window.location.href.includes('element')) ? interactionId : false;
  // 👆 needs to go and also 👇 is error prone, parseInt of false ?
  return [ parseInt(id), setElement ];
};

export const useElementGroupRoute = () => {
  const {elementGroupId, projectId, nodeId} = useParams();
  const navigate = useNavigate();

  const setElementGroup = elementGroupId => {
    navigate(elementGroupPath( {projectId, nodeId, elementGroupId: elementGroupId} ));
  };

  return [ parseInt(elementGroupId), setElementGroup];
};