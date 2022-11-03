import React from 'react';
import SubNav from "components/SubNav";
import {
  adminPath,
  userNotificationsPath,
  activeUsersPath,
  templatesUsedPath,
  landingPagesPath,
  agencyClubContentPath
} from '../routes';
import { useReactiveVar } from "@apollo/client";
import { getAcl } from "../../../graphql/LocalState/acl";


const AdminSubNav = () => {
  const acl = useReactiveVar(getAcl);

  let items = [
    {
        text: 'User Management',
        to: adminPath(),
        icon: 'house-user',
        end: true
    },
  ];

  let adminItems = [];

  if (acl.isAdmin) {
    adminItems = [
      {
        text: 'Active Users Report',
        to: activeUsersPath(),
        icon: 'user',
      },
      {
        text: 'Templates Used',
        to: templatesUsedPath(),
        icon: 'folder',
      },
      {
        text: 'User Notifications',
        to: userNotificationsPath(),
        icon: 'bell-on',
      },
      {
        text: 'Landing Pages',
        to: landingPagesPath(),
        icon: 'browser',
      },
      {
        text: 'Agency Club Content',
        to: agencyClubContentPath(),
        icon: 'film',
      }
    ];
  }

  items = [ ...items, ...adminItems ];

  // if (acl.isAdmin) {
  //   items.push({
  //     text: 'User Notifications',
  //     to: userNotificationsPath(),
  //     icon: 'bell-on',
  //   });
  // }

  return <SubNav items={items} />
};

export default AdminSubNav;