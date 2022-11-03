import {useURLQuery} from "../../graphql/utils";
import {useNavigate} from "react-router-dom";
import {agencyProjectsPath, agencyUsersPath} from "./routes";
import {adminPagePath} from "../user/routes";

export const useAgencyUsersRoute = () => {
    const query = useURLQuery();
    const navigate = useNavigate();
    const modal = query.get('modal');
    const selectedUser = query.get('selectedUser') || null;
    const page = query.get('page') || 1;
    const search = query.get('search') || "";
    const isOpen = modal && modal === 'open';

    const toggleOpenCreateModal = ({modal = false, selectedUser = null, isAdminPage = false, search = "", page = 1}) => {
        let path = agencyUsersPath({modal: modal ? 'open' : 'close', selectedUser});

        if (isAdminPage) {
            path = adminPagePath({modal: modal ? 'open' : 'close', selectedUser, page, search})
        }

        navigate( path );
    };

    return [{isOpen, selectedUser, page, search}, toggleOpenCreateModal];
};

export const useAgencyProjectsRoute = () => {
    const query = useURLQuery();
    const navigate = useNavigate();
    const page = query.get('page') || 1;
    const search = query.get('search') || '';

    const setGroupParams  = (queryParams = {page: 1, search: ""}) => {
        navigate( agencyProjectsPath(queryParams));
    };

    return [{page, search}, setGroupParams];
};