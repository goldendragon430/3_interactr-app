import React from 'react';
import PageBody from "../../../components/PageBody";
import {Route, Routes, useNavigate} from "react-router-dom";
import TrainingPage from "./TrainingPage";
import SubNav from "../../../components/SubNav";
import {trainingAgencyPath, trainingAgencyRoute, trainingPath, trainingProPath, trainingProRoute} from "../routes";
import {agencyVideos, generalVideos, proVideos} from "../utils";
import {useReactiveVar} from "@apollo/client";
import {getWhitelabel} from "../../../graphql/LocalState/whitelabel";
import {getAcl} from "../../../graphql/LocalState/acl";
import {projectsPath} from "../../../modules/project/routes";

const TrainingOverview = () => {
  const navigate = useNavigate();
  const acl = useReactiveVar(getAcl);
  const whitelabel = useReactiveVar(getWhitelabel);

  if(acl.isSubUser || whitelabel) {
    navigate(projectsPath());
    return null;
  }

  return (
    <PageBody  subnav={<TrainingSubNav />}>
      <Routes>
        <Route path={trainingAgencyRoute()} element={ <TrainingAgencyPage /> } />
        <Route path={trainingProRoute()} element={ <TrainingProPage /> } />
        <Route index element={<TrainingGeneralPage />} />
      </Routes>
    </PageBody>
  );
};

export default TrainingOverview;

const TrainingSubNav = () => {
  const  items = [
    {
      text: 'Getting Started',
      to: trainingPath(),
      icon: 'user-graduate',
      end: true
    },
    {
      text: 'Interactr Pro',
      to: trainingProPath(),
      icon: 'user-graduate'
    },
    {
      text: 'Interactr Agency',
      to: trainingAgencyPath(),
      icon: 'user-graduate'
    },
  ];

  return <SubNav items={items} />
}

const TrainingAgencyPage = () => <TrainingPage videos={agencyVideos} breadcrumbText={'Interactr Agency Edition'} />;
const TrainingProPage = () => <TrainingPage videos={proVideos} breadcrumbText={'Interactr Pro'} />;
const TrainingGeneralPage = () => <TrainingPage videos={generalVideos} breadcrumbText={'Getting Started'} />;