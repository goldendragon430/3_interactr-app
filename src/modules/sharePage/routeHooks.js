import {useNavigate, useParams} from "react-router-dom";
import {useURLQuery} from "../../graphql/utils";
import {sharePath} from "../../routeBuilders";

export const useSharePageRoute = () => {
  let {projectHash} = useParams();
  const navigate = useNavigate();
  const query = useURLQuery();
  const page = query.get('page');

  const setSharePageParams = (projectHash, page) => {
    navigate( sharePath(projectHash, page) );
  };

  return [projectHash, setSharePageParams, {page: page ? parseInt(page) : 1}];
};
