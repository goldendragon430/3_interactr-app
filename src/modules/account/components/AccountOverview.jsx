import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
// import Icon from 'components/Icon';
// import Page from 'components/Page';
import { IntegrationsPage, SubUserIntegrationsPage } from 'modules/integration';
import AccountDetailsPage from 'modules/account/components/AccountDetails/AccountDetailsPage';
import AccountDetailsCredentials from './AccountDetailsCredentials';
import SidebarNav from 'components/SidebarNav';
import {useAuthUser} from "../../../graphql/User/hooks";
import Icon from "../../../components/Icon";
import ErrorMessage from "../../../components/ErrorMessage";
import PageBody from "../../../components/PageBody";
import AgencySubNav from "../../agency/components/AgencySubNav";
import SubNav from "../../../components/SubNav";
import {
  accountAffiliatePath,
  accountCustomListsPath,
  accountCustomListsRoute,
  accountIntegrationsPath,
  accountIntegrationsRoute,
  accountPath
} from "../routes";
import CustomListsPage from "./CustomListsPage";
import {getAcl} from "../../../graphql/LocalState/acl";
import {useReactiveVar} from "@apollo/client";
// import SidebarPage from 'components/SidebarPage';
// import styles from './AccountOverview.module.scss';
// import PageBody from 'components/PageBody';


const AccountOverview = () => {
  const acl = useReactiveVar(getAcl);

  return(
    <PageBody subnav={<AccountSubNav  isChildUser={acl.isSubUser} />} >
      {(acl.isSubUser) ? <ChildUserPages /> : <ParentUserPages />}
    </PageBody>
  );
}
export default AccountOverview;

const ChildUserPages = () => {
  return(
    <Routes>
      <Route path={accountIntegrationsRoute()} element={<SubUserIntegrationsPage />} />
      <Route index element={<AccountDetailsPage />} />
    </Routes>
  )
}

const ParentUserPages = () => {
  return(
    <Routes>
      <Route path={accountIntegrationsRoute()} element={<IntegrationsPage />} />
      <Route path={accountCustomListsRoute()} element={<CustomListsPage />} />
      <Route index element={<AccountDetailsPage />} />
    </Routes>
  )
}


function AccountSubNav({isChildUser}){

  const integrations = {
    text: 'Integrations',
    to: accountIntegrationsPath(),
    icon: 'code'
  };
  const accountDetails = {
    text: 'Account Details',
    to: accountPath(),
    icon: 'user-cog',
    end: true
  };
  const affiliate = {
    text: 'Become an Affiliate',
    href: accountAffiliatePath(),
    icon: 'funnel-dollar'
  };
  const customLists = {
    text: 'Custom Lists',
    to: accountCustomListsPath(),
    icon: 'envelope'
  };

  const items = (isChildUser) ? [
    accountDetails, integrations
  ] : [
    accountDetails, integrations, customLists, affiliate
  ];

  return <SubNav items={items} />;
}
