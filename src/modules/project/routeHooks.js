import {useNavigate, useParams} from "react-router-dom";
import {useURLQuery} from "../../graphql/utils";
import {projectsPath, addProjectPath} from "./routes";

export const useAddProjectRoute = () => {
  let {activeTab} = useParams();
  const navigate = useNavigate();
  const query = useURLQuery();
  const page = query.get('page');
  const title = query.get('title');
  const search = query.get('search');

  if(!activeTab) {
    activeTab = 'agency-club-templates-calendar';
  }

  const setTab = ({activeTab, page = 1, title = "", search = ""}) => {
    navigate( addProjectPath({activeTab, page, title, search}) );
  };

  return [{activeTab, page, title, search}, setTab];
};

/**
 * Read and update the project group id in the route
 * @returns {[*, setGroupId]}
 */
export const useProjectGroupRoute = () => {
  let params = useParams();
  let {groupId} = params;
  const navigate = useNavigate();
  const query = useURLQuery();
  const page = query.get('page') || 1;
  const q = query.get('q') || "";
  const orderBy = query.get('orderBy') || "is_favourite";
  const sortOrder = query.get('sortOrder') || "DESC";
  const currentQueryParams = {page, q, orderBy, sortOrder};

  const folderId = parseInt(groupId) ? parseInt(groupId) : null;

  const setGroupParams  = (folderId, queryParams = {page: 1, q: "", orderBy: "is_favourite", sortOrder: "DESC"}) => {
    // check if group set to null, set to 0 for route
    const groupId = folderId ? folderId : 0;
    navigate( projectsPath(groupId, {...currentQueryParams, ...queryParams}) );
  };

  return [folderId, setGroupParams, currentQueryParams];
};