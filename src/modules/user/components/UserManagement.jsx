import React from 'react';
import PropTypes from 'prop-types';
import Modal from 'components/Modal';
import UserDetails from './UserDetails';
import BaseUserForm from "./BaseUserForm";
import {useAgencyUsersRoute} from "../../agency/routeHooks";
import 'components/Table.module.scss';
import cx from "classnames";
import {Table, TableColumn, TableHeading, TableRow} from "../../../components/Table";
import {useURLQuery} from "../../../graphql/utils";

/**
 * This component for rendering users list, it can be used either on AdminPage or AgencyPage components
 * @param users
 * @param isAdminPage
 * @param isAgencyPage
 * @param width
 * @param height
 * @param Pagination
 * @returns {*}
 * @constructor
 */
const UserManagement = ({users, isAdminPage, isAgencyPage, width, height, pagination}) =>  {
    const [{isOpen, selectedUser}, toggleCreateModal] = useAgencyUsersRoute();
    const query = useURLQuery();
    const search = query.get('search') || "";

    const modalProps = {
        showUserModal: isOpen,
        isAdminPage,
        isAgencyPage,
        selectedUser,
        width,
        height
    };
    
    return (
      <div className={cx('col12')} style={{ marginTop: '10px', maxWidth: '1280px' }}>
        <Table>
          <TableHeading>
            <TableColumn span={2}>Name</TableColumn>
            <TableColumn span={2}>Company Name</TableColumn>
            <TableColumn span={2}>Company Logo</TableColumn>
            <TableColumn span={2}>Access</TableColumn>
            <TableColumn span={3}>Projects</TableColumn>
            <TableColumn span={1}>&nbsp;</TableColumn>
          </TableHeading>
          {Array.isArray(users) &&
            users.map((user) => (
              <UserDetails
                key={user.id}
                {...user}
                isAdminPage={isAdminPage}
                onSelect={(userId) => toggleCreateModal({ selectedUser: userId, modal: true, isAdminPage, search })}
              />
            ))
          }
        </Table>

          {/*<table>*/}
          {/*    <thead>*/}
          {/*    <tr>*/}
          {/*        <th>Name</th>*/}
          {/*        <th>Email</th>*/}
          {/*        <th>Access Level</th>*/}
          {/*        <th>Projects</th>*/}
          {/*        <th>Actions</th>*/}
          {/*    </tr>*/}
          {/*    </thead>*/}
          {/*    <tbody>*/}
          {/*    {Array.isArray(users) &&*/}
          {/*    users.map((user) => (*/}
          {/*        <tr key={user.id}>*/}
          {/*            <UserDetails*/}
          {/*                key={user.id}*/}
          {/*                {...user}*/}
          {/*                isAdminPage={isAdminPage}*/}
          {/*                onSelect={(userId) => toggleCreateModal({ selectedUser: userId, modal: true, isAdminPage })}*/}
          {/*            />*/}
          {/*        </tr>*/}
          {/*    ))}*/}
          {/*    </tbody>*/}
          {/*</table>*/}
        <div>
          {pagination}
        </div>

        <UserManagementModal
          {...modalProps}
          close={() => toggleCreateModal({ modal: false, selectedUser: null, isAdminPage, search })}
        />
      </div>
    );
}

const UserManagementModal = ({showUserModal, isAdminPage, isAgencyPage, selectedUser, close, height, width}) => {
    return (
        <Modal
            show={showUserModal}
            onClose={close}
            height={height || 595}
            width={width || 625}
            heading={"User Management"}
            enableFooter={false}
        >
            <BaseUserForm
                isAdminPage={isAdminPage}
                isAgencyPage={isAgencyPage}
                selectedUserID={selectedUser}
                reset={close}
            />
        </Modal>

    )
}

UserManagement.defaultProps = {
  isAdminPage: false
};

UserManagement.propTypes = {
  users: PropTypes.array,
  isAdminPage: PropTypes.bool,
  isAgencyPage: PropTypes.bool,
  width: PropTypes.any,
  height: PropTypes.any
};

export default UserManagement;