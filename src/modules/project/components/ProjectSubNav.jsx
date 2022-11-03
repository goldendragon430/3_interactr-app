import React from 'react';
import SubNav from "../../../components/SubNav";
import {
  adminPagePath,
  projectPath, projectPlayerPath,
  projectSettingsPath,
  projectSharingPage,
  projectStatsPath,
  projectSurveyPath,
  publishProjectPath
} from "../routes";
import {toRoutePath} from "../../../routeBuilders";
import {useParams} from 'react-router-dom'
import {modalsPath} from "../../modal/routes";
import {useReactiveVar} from "@apollo/client";
import {getAcl} from "../../../graphql/LocalState/acl";

const ProjectSubNav = () => {
  const {projectId} = useParams();

  const acl = useReactiveVar(getAcl)

  const  items = [
    {
      text: 'Canvas',
      to: projectPath({ projectId }),
      icon: 'project-diagram',
      end: true
    },
    {
      text: 'Player',
      to: projectPlayerPath({ projectId }),
      icon: 'play'
    },
    {
      text: 'Popups',
      to: modalsPath({ projectId }),
      icon: 'browser'
    },
    {
      text: 'Survey',
      to: projectSurveyPath({ projectId }),
      icon: 'clipboard-user'
    },
    {
      text: 'Analytics',
      to: projectStatsPath({ projectId }),
      icon: 'user-chart'
    },
    {
      text: 'Share Page',
      to: projectSharingPage({ projectId }),
      icon: 'share-alt'
    },
    {
      text: 'Settings',
      to: projectSettingsPath({ projectId }),
      icon: 'cogs'
    },
    {
      text: 'Admin',
      to: adminPagePath({ projectId }),
      icon: 'lock',
      locked: ! acl.isAdmin
    },
  ];

  return <SubNav items={items} />
};
export default ProjectSubNav;

