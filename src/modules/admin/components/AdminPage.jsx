import React, {useState} from 'react';
import Button from 'components/Buttons/Button';
import styles from '../../project/components/ProjectSettingsPage.module.scss';
import UserManagement from '../../user/components/UserManagement';
import {Option, TextInput, BooleanInput} from "components/PropertyEditor";
import {useCreateUser} from "../../../graphql/User/hooks";
import Icon from "components/Icon";
import ErrorMessage from "components/ErrorMessage";
import Pagination from "components/Pagination";
import {AnimatePresence, motion} from "framer-motion";
import {animationState, preAnimationState, transition} from "components/PageBody";
import {useAgencyUsersRoute} from "../../agency/routeHooks";
import {useQuery} from "@apollo/client";
import {GET_USERS} from "../../../graphql/User/queries";
import {setBreadcrumbs} from "../../../graphql/LocalState/breadcrumb";
import {setPageHeader} from "../../../graphql/LocalState/pageHeading";
import { useReactiveVar } from "@apollo/client";
import { getAcl } from "../../../graphql/LocalState/acl";
import { addItem } from '@/graphql/utils';
import { useSetState } from 'utils/hooks';
import { errorAlert } from 'utils/alert';
import Modal from 'components/Modal';


export const DEFAULT_FILTERS = {
  search: "",
  first: 20,
  page: 1
};

const AdminPage = () => {
  const acl = useReactiveVar(getAcl);
  const [{page, search}, togglePageUpdates] = useAgencyUsersRoute();
  
  const {data, loading, error} = useQuery(GET_USERS, {
      variables: {
          search,
          page: parseInt(page),
          first: 20
      }
  });

  setBreadcrumbs([
    {text: 'Admin', link: '/admin'},
    {text: 'User Management'},
  ]);

  setPageHeader('User Management');

  if(loading) return <Icon loading />;

  if(error) return <ErrorMessage error={error} />;

  const users = data.result;

  return (
      <AnimatePresence>
        <motion.div
            exit={preAnimationState}
            initial={preAnimationState}
            animate={animationState}
            transition={transition}
        >
          <AdminPageBody
              users={users}
              defaultSearchTerm={search}
              isSuperUser={acl.isAdmin}
              togglePageUpdates={togglePageUpdates}
          />
        </motion.div>
      </AnimatePresence>
  )
};

/**
 * ONLY FOR ADMINS
 * Page for looking users list
 * Allow editing/deleting users
 * @returns {string|*}
 * @constructor
 */
const AdminPageBody = ({users = {data: [], paginatorInfo: {}}, defaultSearchTerm, isSuperUser, togglePageUpdates}) => {
  const [search, setSearch] = useState(defaultSearchTerm);
  const [showAddUser, setShowAddUser] = useState(false);
  const {data: usersData, paginatorInfo} = users;

  const toggleAdminPageUpdates = (data = {}) => {
      togglePageUpdates({isAdminPage: true, ...data, search})
  };

  const handleKeyPress = e => {
    if(e.key === 'Enter') toggleAdminPageUpdates();
  };

  if (! isSuperUser) return 'Unauthorised';
  
  return (
      <div style={{ paddingLeft: 10 }}>
        <div className="grid">
          <div className="col12">
            <div className={styles.formWrapper}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <h2 className="form-heading" style={{ paddingLeft: 30 }}>User Search</h2>
              <div style={{ paddingRight: 30 }}>
                <AddUserModal 
                  show={showAddUser} 
                  onClose={() => setShowAddUser(false)} />
                <Button 
                  primary
                  icon="plus"
                  onClick={() => setShowAddUser(true)}
                >
                  Add New User
                </Button>
              </div>
              
              </div>
              <div style={{ display: 'flex', paddingLeft: 15 }}>
                <Option
                  style={{display: 'inline-block', width: '30%'}}
                  label="Search"
                  value={search}
                  Component={TextInput}
                  onKeyPress={handleKeyPress}
                  onChange={setSearch}
                />
                <Button
                  right
                  icon="search"
                  primary
                  onClick={() => toggleAdminPageUpdates()}
                  style={{margin: '23px 10px'}}
                >
                  Search
                </Button>
              </div>
            </div>
          {/* </div> */}
          {/*<div className="col7">*/}
          {/*    <div className={styles.formWrapper}>*/}
          {/*      <TemplateLanguages />*/}
          {/*    </div>*/}
          </div>
        </div>
        <div className="grid">
          <div className="col12">
            <div className={styles.formWrapper}>
              <UserManagement
                users={usersData}
                isAdminPage={true}
                isAgencyPage={false}
                pagination={
                  <UserPaginator
                      paginatorInfo={paginatorInfo}
                      onChange={page => {
                          toggleAdminPageUpdates({ page })
                      }}
                  />
                }
              />
            </div>
          </div>
        </div>
      </div>
  );
}

export default AdminPage;

/**
 * UserPaginator gives pagination functionality for users list ONLY FOR ADMINS
 * @param paginatorInfo
 * @param onChange
 * @returns {*}
 * @constructor
 */
const UserPaginator = ({paginatorInfo, onChange}) => {
  const maxPageCount = paginatorInfo.total / paginatorInfo.perPage;
  const [{page = 1}] = useAgencyUsersRoute();

  return (
      <Pagination
          forcePage={page}
          dataCount={paginatorInfo.count}
          pageCount={maxPageCount}
          onPageChange={onChange}
      />
  )
};

const AddUserModal = ({ show, onClose }) => {
  const NEW_USER = {
    name: '',
    email: '',
    password: '',
    is_club: 0,
    is_agency: 0,
    is_pro: 0,
    is_agency_club: 0,
  };

  const [state, setState] = useSetState(NEW_USER);

  const options = {
    onCompleted() {
      onCancel();
    }
  }

  let createUserOptions = {
    ...options
  }
  
  createUserOptions.update = (cache, { data: { createUser } }) => {
    try {
      addItem(cache, GET_USERS, createUser, 'data', DEFAULT_FILTERS);
    } catch (e) {
      console.log(e);
    }
  }

  const [createUser, {loading, error}] = useCreateUser(options);

  if(error) {
    console.error(error);
    errorAlert({text: 'Unable to create new user'})
  }

  const onCancel = () => {
    setState({ ...NEW_USER });
    onClose();
  };

  const onCreate = async () => {
    if (!state.advanced_analytics) {
      state.max_projects = 3;
      // state.advanced_analytics = 0;
    }

    state.email = state.email.toLowerCase();
    state.upgraded = 1
    // Create brand new user
    await createUser({...state});
  }

  const changeHandler = (key) => (value) => {
    setState({[key]: value});
  };
  
  return (
    <Modal
      show={show}
      onBack={onCancel}
      onClose={onCancel}
      height={800}
      width={1200}
      closeMaskOnClick={false}
      heading={
          <><Icon name="plus" /> Add New User</>
      }
      submitButton={
        <Button 
          primary
          icon="save" 
          loading={loading}  
          onClick={onCreate}
        >
          Save
        </Button>
      }
    >
      <AddUserForm 
        user={state}
        changeHandler={changeHandler} 
        disableInputs={loading} 
      />
    </Modal>
  )
}

const AddUserForm = ({ user, changeHandler, disableInputs }) => {
  const {
      name,
      email,
      password,
      is_club,
      is_agency,
      is_pro,
      is_agency_club,
  } = user;

  return (
    <div>
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
              type="password"
              value={password}
              Component={TextInput}
              onChange={changeHandler('password')}
              disabled={disableInputs}
          />
        </div>
        <div className="col6">
          <div className="grid">
            <div className="col12">
              <h3>New User Access Levels</h3>
              <Option
                label="Pro"
                value={is_pro}
                Component={BooleanInput}
                onChange={changeHandler('is_pro')}
                disabled={disableInputs}
              />
              <Option
                label="Agency Club"
                value={is_agency_club}
                Component={BooleanInput}
                onChange={changeHandler('is_agency_club')}
                disabled={disableInputs}
              />
              <h3>Legacy User Access Levels (Pre Evolution)</h3>
              <Option
                label="Club"
                value={is_club}
                Component={BooleanInput}
                onChange={changeHandler('is_club')}
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
          </div>
        </div>
      </div>
    </div>
  );
}
