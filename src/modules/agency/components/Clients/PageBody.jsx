import React, { useEffect,useState } from "react";
import { useReactiveVar } from "@apollo/client";
import { Menu, MenuButton, MenuItem } from "@szhsin/react-menu";
import Modal from 'components/Modal';
import map from "lodash/map";
import reduce from "lodash/reduce";
import { useNavigate, useParams } from "react-router-dom";
import Button from "../../../../components/Buttons/Button";
import Icon from "../../../../components/Icon";
import { getClientModal, setClientModal } from "../../../../graphql/LocalState/clientModal";
import { useAuthUser, useCreateUser, useDeleteUser, useSaveUser, useUser } from "../../../../graphql/User/hooks";
import { deleteConfirmed } from "../../../../graphql/utils";
import { errorAlert } from "../../../../utils/alert";
import AgencyUserForm from "../../../user/components/AgencyUserForm";
import { AgencyClientsPagePath } from "../../routes";
import validator from "validator";
import ProfileCover from "./ProfileCover";
import ProjectsList from "./ProjectsList";
import {toast} from 'react-toastify'
const PageBody = () => {
    const authUser = useAuthUser();
    const navigate = useNavigate();
    const {clientId: selectedUserID } = useParams();
    const [modalState,setModalState] = useState(false)
    useEffect(() => {
        if(!selectedUserID) navigate(AgencyClientsPagePath({clientId: authUser.subusers.length ? authUser.subusers[0].id : 0}));
    }, [selectedUserID]);

    const {showModal} = useReactiveVar(getClientModal);

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
    if(modalState)
    {
        if(mutationError) {
        console.error(mutationError);
        errorAlert({text: 'Unable to save  user'})
        setModalState(false)
        }

    if(createUserError) {

        const errorMsg = createUserError.graphQLErrors
        if (errorMsg[0]['debugMessage'].includes('Duplicate entry')){
            console.log("Entered")
            errorAlert({text: 'User already exists with the email.'})
        }
        else
            errorAlert({text: 'Unable to create new user'})

        setModalState(false)

    }

    if(deleteUserError) {
        console.error(deleteUserError);
        errorAlert({text: "Unable to delete user"})
        setModalState(false)

    }
}

    const handleCreate = async (user) => {
        user.email = user.email.toLowerCase();
        user.upgraded = 1
        const isValid = validator.isEmail(user.email);
		if(!isValid){
		  errorAlert({text:'Email is invalid.'})
		  return	
		}
        setModalState(true)
        // Create brand new user
        const { data } = await createUser({...user});
        setModalState(false)

        navigate(AgencyClientsPagePath({clientId: data.createUser.id}));
    }

    const handleUpdate = (user) => {
        setModalState(true)

        if (!user.password) {
          delete user.password
        }

        let {subusers, superuser, max_projects, parent_user_id, gravatar, parent, ...userData} = user;

        // Update User
        saveUser({...userData});
        setModalState(false)

    }    

    const handleDelete = async (userId) => {
        setModalState(true)

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
        toast.success('Success')
        setModalState(false)

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

                    <div className={'grid'} style={{paddingTop: '50px'}}>
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