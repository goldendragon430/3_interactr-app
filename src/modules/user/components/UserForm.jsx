import React from 'react';
import ManageUserProjects from './ManageUserProjects';
import { TextInput, Option, BooleanInput } from '../../../components/PropertyEditor';
import Swal from 'sweetalert2';
import Button from 'components/Buttons/Button';
import IconButton from 'components/Buttons/IconButton';
import PropTypes from 'prop-types'
import {useSetState} from "../../../utils/hooks";
import {useAuthUser, useSaveUser, useCreateUser, useDeleteUser, useUser} from "../../../graphql/User/hooks";
import Icon from "../../../components/Icon";
import ErrorMessage from "../../../components/ErrorMessage";
import {GET_USERS} from "../../../graphql/User/queries";
import {addItem} from "../../../graphql/utils";
import {DEFAULT_FILTERS} from "../../admin/components/AdminPage";
import validator from 'validator';
const _props = {
  isAdminPage : PropTypes.bool.isRequired,
  /** set if we're an agency editing sub user as opposed to admin editing any user */
  isAgencyPage : PropTypes.bool.isRequired,
  /** id of selected user  */
  selectedUserID: PropTypes.oneOfType([
    PropTypes.string,PropTypes.number,
  ]).isRequired,
  selected: PropTypes.func,
}

const UserForm = ({selectedUserID, reset, isAdminPage, isAgencyPage}) => {
  const initialUserData = {
    name: '',
    email: '',
    projects: [],
    password: ''
  };

  const [state, setState] = useSetState({
    newUser: initialUserData
  });

  const resetSelectedUser = () => {
    reset();
    setState({ newUser: initialUserData });
  };

  const [selectedUser, updateUser, {error, loading}] = useUser(selectedUserID);

  const options = {
    onCompleted() {
      resetSelectedUser();
    }
  }
  const [saveUser, {loading: saving, error: mutationError}] = useSaveUser(options);

  let createUserOptions = {
      ...options
  }

  /**
   * If UserManagement used in AdminPages, update global list after creating new user
   * If UserManagement used in AgencyPages, update auth user sub users list with new item
   */
  if (isAdminPage) {
    createUserOptions.update = (cache, { data: { createUser } }) => {
      try {
        addItem(cache, GET_USERS, createUser, 'data', DEFAULT_FILTERS);
      } catch (e) {}
    }
  }

  const [createUser, {loading: createUserSaving, error: createUserError}] = useCreateUser(createUserOptions);
  const [deleteUser, {loading: deleteUserSaving, error: deleteUserError}] = useDeleteUser(null, options);

  const disableInputs = (saving || createUserSaving);

  if(loading) return <Icon loading />;

  if(error) return <ErrorMessage error={error} />;

  const thereIsSelectedUser = () => selectedUserID && selectedUser;

  const getUser = () => {
    if (thereIsSelectedUser()) {
      return selectedUser;
    }

    return state.newUser;
  };

  // Update single user
  const handleUpdateUser = () => {
    let {subusers, superuser, max_projects, parent_user_id, ...user} = getUser();

    // Update User
    saveUser({...user});
  };

  // Create brand new user
  // If user creating by admin user, check the advanced_analytics. If so set default values (taken from old functionality)
  const handleCreateUser = () => {
    if (isAdminPage) {
      if (!user.advanced_analytics) {
        user.max_projects = 3;
        user.advanced_analytics = 0;
      }
    }

    if (isAgencyPage) {
      user.email = user.email.toLowerCase();
      const isValid = validator.isEmail(user.email);
      if(!isValid){
        errorAlert({text:'Email is invalid.'})
        return	
      }
      user.agency_page = 1;
    }
    user.upgraded = 1
    createUser({...user});
  }

  const updateInLocalState = (key, val) => {
    let user = { ...state.newUser };
    user[key] = val;
    setState({ newUser: user });
  };

  const changeHandler = (key) => (value) => {
    if (thereIsSelectedUser()) {
      updateUser(key, value);
      return;
    }

    updateInLocalState(key, value);
  };

  const deleteConfirm = () => {
    Swal.fire({
      title: 'Delete user',
      text: 'Are you sure you wish to delete this user?',
      icon: 'warning',
      showCloseButton: true,
      showCancelButton: true,
      confirmButtonColor: '#ff6961',
      confirmButtonText: 'Delete user'
    }).then((result) => {
      if(result.isConfirmed) {
        const user = getUser();
        deleteUser(null, parseInt(user.id));
      }
    });
  };

  const user = getUser();

  if(! user) return null;

  const {
    id: userId,
    name,
    email,
    projects,
    password,
    is_club,
    is_agency,
    evolution,
    evolution_pro,
    evolution_club,
    masterclass,
    is_local,
    advanced_analytics,
    read_only
  } = user;

  return (
    <div>
      <div className="modal-heading">User Management</div>
      <div className="modal-body">
        <div className="grid">
          <div className="col6">
            <Option
              label="Name"
              value={name}
              Component={TextInput}
              onChange={changeHandler('name')}
              disabled={disableInputs}
            />
            <Option
              label="Email"
              value={email}
              Component={TextInput}
              placeholder="me@myemail.com"
              onChange={changeHandler('email')}
              disabled={disableInputs}
            />
            <Option
              label="Password"
              value={password}
              Component={TextInput}
              onChange={changeHandler('password')}
              disabled={disableInputs}
            />
            {isAgencyPage && (
              <Option
                label="Read Only"
                value={read_only}
                Component={BooleanInput}
                onChange={changeHandler('read_only')}
                disabled={disableInputs}
              />
            )}
          </div>
          <div className="col6">
            {isAgencyPage && (
               <ManageUserProjects
                selectedProjects={[...projects]}
                onChange={changeHandler}
              />
            )}
            {isAdminPage && (
              <div className="grid">
                <div className="col6">
                  <Option
                      label="Commercial"
                      value={advanced_analytics}
                      Component={BooleanInput}
                      onChange={changeHandler('advanced_analytics')}
                      disabled={disableInputs}
                  />
                  <Option
                      label="Club"
                      value={is_club}
                      Component={BooleanInput}
                      onChange={changeHandler('is_club')}
                      disabled={disableInputs}
                  />
                  <Option
                      label="Local"
                      value={is_local}
                      Component={BooleanInput}
                      onChange={changeHandler('is_local')}
                      disabled={disableInputs}
                  />
                  <Option
                      label="Agency"
                      value={is_agency}
                      Component={BooleanInput}
                      onChange={changeHandler('is_agency')}
                      disabled={disableInputs}
                  />
                </div>
                <div className="col6">
                  <Option
                      label="Evolution"
                      value={evolution}
                      Component={BooleanInput}
                      onChange={changeHandler('evolution')}
                      disabled={disableInputs}
                  />
                  <Option
                      label="Evolution Pro"
                      value={evolution_pro}
                      Component={BooleanInput}
                      onChange={changeHandler('evolution_pro')}
                      disabled={disableInputs}
                  />
                  <Option
                      label="Evolution Club"
                      value={evolution_club}
                      Component={BooleanInput}
                      onChange={changeHandler('evolution_club')}
                      disabled={disableInputs}
                  />
                  <Option
                      label="Masterclass"
                      value={masterclass}
                      Component={BooleanInput}
                      onChange={changeHandler('masterclass')}
                      disabled={disableInputs}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="modal-footer">
        {userId ? (
          <IconButton red onClick={deleteConfirm} style={{ float: 'left' }} icon="trash-alt">
            Delete User
          </IconButton>
        ) : null}
        <Button icon="save" loading={saving} primary onClick={thereIsSelectedUser() ? handleUpdateUser : handleCreateUser}>
          Save
        </Button>
        <Button onClick={resetSelectedUser} loading={saving}>
          Back
        </Button>
      </div>
    </div>
  );
}

UserForm.propTypes = _props ;

export default UserForm;