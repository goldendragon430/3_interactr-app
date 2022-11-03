import React from 'react'
import AdminSubNav from "./AdminSubNav";
import Icon from "components/Icon";
import {Route, Routes} from "react-router-dom";
import Button from "components/Buttons/Button";
import PageBody from "components/PageBody";
import Upgrade from "components/Upgrade";
import AdminPage from "./AdminPage";
import ActiveUsersPage from "./ActiverUsersPage";
import UserNotificationsPage from "./UserNotificationsPage";
import TemplatesUsedPage from "./TemplatesUsedPage";
import {
  adminPath,
  activeUsersPath,
  userNotificationsPath,
  templatesUsedPath,
  landingPagesPath,
  agencyClubContentPath
} from "../routes";
import ErrorMessage from "components/ErrorMessage";
import { useReactiveVar } from "@apollo/client";
import { getAcl } from "../../../graphql/LocalState/acl";
import LandingPagesPage from "./LandingPagesPage";
import AgencyClubContentPage from "./AgencyClubContentPage";


const AdminOverview = ()=>{
  const acl = useReactiveVar(getAcl);

  return(
    <PageBody subnav={<AdminSubNav />}>
      {acl.isAdmin ? <AdminPages /> : null}
    </PageBody>
  );
};
export default AdminOverview;

const AdminPages = () => {
  const acl = useReactiveVar(getAcl);
  
  return (
    <Routes>
      <Route path={adminPath()} exact component={AdminPage} />
      {acl.isAdmin && <Route path={userNotificationsPath()}  component={UserNotificationsPage} />}
      {acl.isAdmin && <Route path={activeUsersPath()} exact component={ActiveUsersPage} />}
      {acl.isAdmin && <Route path={templatesUsedPath()} component={TemplatesUsedPage} />}
      {acl.isAdmin && <Route path={landingPagesPath()} component={LandingPagesPage} />}
      {acl.isAdmin && <Route path={agencyClubContentPath()} component={AgencyClubContentPage} />}
    </Routes>
  )
};




