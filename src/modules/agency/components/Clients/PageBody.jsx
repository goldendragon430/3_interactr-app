import Icon from "../../../../components/Icon";
import React, {useState, useEffect} from "react";
import Button from "../../../../components/Buttons/Button";
import Modal from 'components/Modal';
import {deleteConfirmed} from "../../../../graphql/utils";
import {Menu, MenuButton, MenuItem} from "@szhsin/react-menu";
import map from "lodash/map";
import AgencyUserForm from "../../../user/components/AgencyUserForm";
import ProjectsList from "./ProjectsList";
import ProfileCover from "./ProfileCover";
import {gql, useReactiveVar} from "@apollo/client";
import {getClientModal, setClientModal} from "../../../../graphql/LocalState/clientModal";
import ErrorMessage from "../../../../components/ErrorMessage";
import {cache} from "../../../../graphql/client";
import {useNavigate, useParams} from "react-router-dom";
import {AgencyClientsPagePath} from "../../routes";
import {errorAlert} from "../../../../utils/alert";
import {useAuthUser, useCreateUser, useDeleteUser, useSaveUser, useUser} from "../../../../graphql/User/hooks";
import reduce from "lodash/reduce";

const PageBody = () => {
    const authUser = useAuthUser();
    const navigate = useNavigate();
    const {showModal} = useReactiveVar(getClientModal);

    const {clientId: selectedUserID } = useParams();

    const handleClose = () => {
        setClientModal(false);
    }

    const options = {
        onCompleted() {
            handleClose();
        }
    }

    const [selectedUser, updateUser, {error, loading}] = useUser(selectedUserID);
    const [saveUser, {loading: updateUserLoading, error: mutationError}] = useSaveUser(options);
    const [createUser, {loading: createUserLoading, error: createUserError}] = useCreateUser(options);
    const [deleteUser, {loading: deleteUserLoading, error: deleteUserError}] = useDeleteUser(null, options);

    if(loading) return <div style={{marginLeft: '30px'}}><Icon loading /></div>;    
    const disableInputs = loading || updateUserLoading || createUserLoading || deleteUserLoading;
    if(mutationError) {
        console.error(mutationError);
        errorAlert({text: 'Unable to save  user'})
    }

    if(createUserError) {
        console.error(createUserError);
        errorAlert({text: 'Unable to create new user'})
    }

    if(deleteUserError) {
        console.error(deleteUserError);
        errorAlert({text: "Unable to delete user"})
    }

    const handleCreate = async (user) => {
        user.email = user.email.toLowerCase();
        // Create brand new user
        const { data } = await createUser({...user});
        navigate(AgencyClientsPagePath({clientId: data.createUser.id}));
    }

    const handleUpdate = (user) => {
        if (!user.password) {
          delete user.password
        }

        let {subusers, superuser, max_projects, parent_user_id, gravatar, parent, ...userData} = user;

        // Update User
        saveUser({...userData});
    }    

    const handleDelete = async (userId) => {
        await deleteConfirmed(
            'user',
            async () => {
                const { data } = await deleteUser(null, parseInt(userId));
                let subusers = reduce(authUser.subusers, (result, subuser) => {
                    if(subuser.id == userId)
                        return result;
                    return result.concat(subuser);
                }, []);
                navigate(AgencyClientsPagePath({clientId: subusers.length > 0 ? subusers[0].id : 0}));
            }
        );
    }

    const formProps = {
        deleteConfirmed,
        updateUser: () => {console.log("updateUser")},
        onCreate: handleCreate,
        onUpdate: handleUpdate,
        onDelete: handleDelete,
        disableInputs: disableInputs,
        reset: handleClose
    };
    
    return(
        <div>
            {selectedUser && (
                <>
                    <div style={{marginBottom: '30px'}}>
                        <Menu menuButton={<MenuButton>Change Client <Icon name={'angle-down'} style={{marginRight: 0}} /> </MenuButton>}>
                            { map (authUser.subusers, (subuser, index) => (
                                <MenuItem onClick={() => {navigate(AgencyClientsPagePath({clientId: subuser.id}))}} key={`subuser-${index}`}>{subuser?.name}</MenuItem>
                            ))}
                        </Menu>
                    </div>

                    <ProfileCover />

                    <div className={'grid'} style={{paddingTop: '10px'}}>
                        <div className={'col12'}>
                            <h2>Client Projects</h2>
                            <ProjectsList projectIds={selectedUser?.projects} userId={selectedUser.id}/>
                        </div>
                    </div>
                </>
            )}

            {!selectedUser && (
                <Button icon="plus" right primary onClick={() => {setClientModal({showModal: true});}}>
                    Create User
                </Button>
            )}
            <Modal
                onClose={handleClose}
                show={showModal}
                width={700}
                height={650}
                heading={
                    selectedUser ? <><Icon name="pen-square" />Edit User</> : <><Icon name="pen-square" />Create User</>
                }
                enableFooter={false}
            >
                <AgencyUserForm {...formProps} selectedUserID={selectedUserID} selectedUser={selectedUser}/>
            </Modal>
        </div>
    )
};

export default PageBody;