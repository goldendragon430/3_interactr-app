import {useNavigate, useParams} from "react-router-dom";
import {nodePath} from "./routes";

export const useNodeRoute = () => {
  const {nodeId, projectId} = useParams();
  const navigate = useNavigate();

  const setNodeId = nodeId => {
    navigate( nodePath({nodeId, projectId}));
  };

  return [nodeId, setNodeId];
};