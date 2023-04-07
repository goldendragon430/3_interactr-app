import React from 'react'
import {useAuthUser} from "../../../graphql/User/hooks";
import AgencySubNav from "./AgencySubNav";
import Icon from "../../../components/Icon";
import {useAgency, useSaveAgency} from "../../../graphql/Agency/hooks";
import {Route, Routes} from "react-router-dom";
import Button from "../../../components/Buttons/Button";
import PageBody from "../../../components/PageBody";
import Upgrade from "../../../components/Upgrade";
import AgencyPage from "./AgencyPage";
import ConsultantKitPage from "./ConsultantKitPage";
import AgencyUsersPage from "./AgencyUsersPage";
import {
  agencyUsersRoute,
  agencyClientsPageRoute,
  agencyConsultingKitRoute,
  interactiveVideosRoute, 
  landingPagesRoute,
  leadsRoute,
  agencyAppSetupRoute,
  agencyPath
} from "../routes";
import ErrorMessage from "../../../components/ErrorMessage";
import AgencyInteractiveVideosPage from "./AgencyInteractiveVideosPage";
import AgencyLandingPages from "./AgencyLandingPages";
import AgencyLeadsPage from "./AgencyLeadsPage";
import AgencyAppSetupPage from "./AgencyAppSetup/AgencyAppSetupPage";
import ClientsPage from "./Clients/ClientsPage";
import {toRoutePath} from "../../../routeBuilders";
import {getAcl} from "../../../graphql/LocalState/acl";
import {useReactiveVar} from "@apollo/client";


const AgencyOverview = ()=>{
  const acl = useReactiveVar(getAcl);

  return(
    <PageBody subnav={<AgencySubNav />}>
      {(acl.isSubUser) ? <UpgradeMessage /> : <AgencyPages />}
    </PageBody>
  );
};
export default AgencyOverview;

const AgencyPages = () => {  
  return (
    <Routes>
      <Route path={agencyUsersRoute()} element={ <AgencyUsersPage /> } />
      <Route path={agencyConsultingKitRoute()} element={ <ConsultantKitPage /> } />
      <Route
        path={interactiveVideosRoute()}
        element={<AgencyInteractiveVideosPage
          breadcrumb={[
            {text: 'Agency', link: '/agency/dashboard'},
            {text: 'Done For You Interactive Videos'}
          ]}
          heading={'Done For You Interactive Videos'}
          />}
      />
      <Route path={landingPagesRoute()}  element={ <AgencyLandingPages /> } />
      <Route path={leadsRoute()}  element={ <AgencyLeadsPage />}/>
      <Route path={agencyAppSetupRoute()} element={ <AgencyAppSetupPage /> } />
      <Route path={toRoutePath(agencyClientsPageRoute, ['clientId'])} element={ <ClientsPage /> } />
      <Route path='/clients/*' element={ <ClientsPage /> } />
      <Route index element={<AgencyPage />} />
    </Routes>
  )
};


const UpgradeMessage = () => {
  return  <Upgrade
    text="To use the Agency feature you must upgrade!"
    url="http://special.interactr.io/agency-academy/a.html"
  />
};




