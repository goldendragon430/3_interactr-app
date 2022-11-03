import React, {useState} from 'react';
import AdminUserForm from "./AdminUserForm";
import AgencyUserForm from "./AgencyUserForm";
import Swal from "sweetalert2";
import PropTypes from "prop-types";
import {useCreateUser, useDeleteUser, useSaveUser, useUser} from "../../../graphql/User/hooks";
import Icon from "../../../components/Icon";
import ErrorMessage from "../../../components/ErrorMessage";
import {deleteConfirmed} from "../../../graphql/utils";
import {errorAlert} from "../../../utils/alert";
import Button from "../../../components/Buttons/Button";
/**
 * Render either AdminUserForm or AgencyUserForm component based on opened page
 * @param isAdminPage
 * @param isAgencyPage
 * @param selectedUserID
 * @param reset
 * @returns {*}
 * @constructor
 */
const BaseUserForm = ({isAdminPage, isAgencyPage, selectedUserID, reset}) => {
    const [selectedUser, updateUser, {error, loading}] = useUser(selectedUserID);

    const options = {
        onCompleted() {
            reset();
        }
    }

    const [saveUser, {loading: updateUserLoading, error: mutationError}] = useSaveUser(options);
    const [createUser, {loading: createUserLoading, error: createUserError}] = useCreateUser(options);
    const [deleteUser, {loading: deleteUserLoading, error: deleteUserError}] = useDeleteUser(null, options);

    if(error) return <ErrorMessage error={error} />;

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

    const onUpdate = (user) => {
        if (!user.password) {
          delete user.password
        }

        let {subusers, superuser, max_projects, parent_user_id, gravatar, parent, ...userData} = user;

        // Update User
        saveUser({...userData});
    }

    const onCreate = (user) => {
        user.email = user.email.toLowerCase();
        // Create brand new user
        createUser({...user});
    }

    const onDelete = async (userId) => {
        await deleteConfirmed(
            'user',
            () => {
                deleteUser(null, parseInt(userId));
            }
        );
    }

    const disableInputs = loading || updateUserLoading || createUserLoading || deleteUserLoading;

    const formProps = {
        deleteConfirmed,
        selectedUserID,
        selectedUser: selectedUserID && selectedUser ? selectedUser : null,
        updateUser,
        onCreate,
        onUpdate,
        onDelete,
        disableInputs,
        reset
    };

    return (
        <div>
            {isAdminPage ? (
                <AdminUserForm {...formProps} />
            ) : null}

            {isAgencyPage ? (
                <AgencyUserForm {...formProps} />
          ) : null}
        </div>
    );
};

const _props = {
    isAdminPage : PropTypes.bool.isRequired,
    /** set if we're an agency editing sub user as opposed to admin editing any user */
    isAgencyPage : PropTypes.bool.isRequired,
    /** id of selected user  */
    selectedUserID: PropTypes.oneOfType([
        PropTypes.string,PropTypes.number,
    ]).isRequired,
}

BaseUserForm.propTypes = _props ;
export default BaseUserForm;