import {useNavigate, useParams} from "react-router-dom";
import {interactionPath} from "./routes";
import {nodePath} from "../node/routes";

/**
 * Use the interaction route by setting and reading the interaction ID in the route
 * @returns {[{interactionId: *, projectId: *, nodeId: *}, {setInteraction: setInteraction}]}
 */
export const useInteractionRoute = () => {
  const {projectId, nodeId, interactionId} = useParams();
  const navigate = useNavigate();

  const setInteraction = interactionId => {
    navigate(interactionPath( {projectId, nodeId, interactionId} ));
  };

  // Clear the active interaction from the route
  const back = () => {
    navigate(nodePath( {projectId, nodeId} ));
  };

  return [ interactionId, setInteraction, back ];
};