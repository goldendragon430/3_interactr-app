import {useURLQuery} from "../../graphql/utils";
import {useNavigate, useParams} from "react-router-dom";
import {projectPath} from "../project/routes";
import {videosPath} from "./routes";

export const useMediaLibraryRoute = () => {
  const query = useURLQuery();
  const {projectId} = useParams();
  const openQuery = query.get('library');
  const activeTab = query.get('activeTab');
  const filterBy = query.get('filterBy');
  const page = query.get('page');
  const q = query.get('q');
  const navigate = useNavigate();

  const isOpen = (openQuery && openQuery==='open');

  // const toggleLibrary = (toggle, activeTab = 'all', page = 1) => {
  //   navigate( projectPath({projectId, library: (toggle) ? 'open' : false, activeTab, page}) );
  // };

  const setMediaRouteParams = ({activeTab = 'all', page = 1, q = "", filterBy = 'all'}) => {
    navigate( projectPath({page, q, projectId, filterBy, activeTab, library: 'open'}) );
  };

  return [{isOpen, activeTab, page, filterBy, q}, setMediaRouteParams];
};

export const useVideosPageRoute = () => {
  const navigate = useNavigate();
  const query = useURLQuery();
  const page = query.get('page');
  const q = query.get('q');
  const orderBy = query.get('orderBy');
  const sortOrder = query.get('sortOrder');
  const project_id = query.get('project_id');
  const filterBy = query.get('filterBy');
  const activeTab = query.get('activeTab');

  const setVideosPageParams = ({page = 1, activeTab, q = "", orderBy = "created_at", project_id = 0, sortOrder = 'DESC', filterBy = 'all'}) => {
    navigate( videosPath({page, q, orderBy, project_id, sortOrder, filterBy, activeTab}) );
  };

  const toggleLibrary = (page = 1, activeTab = 'all') => {
    navigate( videosPath({page, q, orderBy, project_id, sortOrder, filterBy: 'all', activeTab}) );
  }

  return [{page, q, orderBy, project_id, sortOrder, filterBy, activeTab}, setVideosPageParams, toggleLibrary];
};