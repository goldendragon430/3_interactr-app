import React from 'react';
import Button from "../../../components/Buttons/Button";
import {useAgencyUsersRoute} from "../../agency/routeHooks";
import {useURLQuery} from "../../../graphql/utils";

const CreateUserButton = ({isAdminPage}) => {
    const [_, toggleCreateModal] = useAgencyUsersRoute();
    const query = useURLQuery();
    const search = query.get('search') || "";

    const handleOpenPopup = () => {
        toggleCreateModal({selectedUser: null, modal: true, isAdminPage, search});
    };

    return (
        <Button primary  icon="plus" onClick={handleOpenPopup}>
            Create New User
        </Button>
    );
};

export default CreateUserButton;