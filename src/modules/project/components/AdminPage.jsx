import React from 'react';
import { useProjectsById } from "../../../graphql/Project/hooks";
import TemplateProperties from '../../template/components/TemplateProperties';
import {dashboardPath} from "../../dashboard/routes";
import {projectsPath} from "../routes";
import {setBreadcrumbs} from "../../../graphql/LocalState/breadcrumb";
import {useParams} from "react-router-dom";
import Icon from "../../../components/Icon";
import {useQuery} from "@apollo/client";
import {GET_PROJECT} from "../../../graphql/Project/queries";


const AdminPage = (props) => {
  const { projectId } = useParams();

  // We can use cache only here as the ProjectOverview component loads the project into the cache
  const {data, loading, error} = useQuery(GET_PROJECT, {
    variables: {projectId},
    fetchPolicy: 'cache-only'
  });

  setBreadcrumbs([
    {text: 'Dashboard', link: dashboardPath()},
    {text: 'Projects', link: projectsPath()},
    {text: 'Admin'},
  ]);

  if(loading) return <Icon loading />

  if(error) return null;

  // console.log(projects, projectId);
  // console.log(projects);

  return <TemplateProperties item={data.result} />;
}

export default AdminPage;