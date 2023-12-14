import React from 'react';

import { useProjects } from '@/graphql/Project/hooks';
import { useProjectGroups } from '@/graphql/ProjectGroup/hooks';
import { ErrorMessage } from 'components';
import { useProjectGroupRoute } from 'modules/project/routeHooks';
import { NoProjects } from './NoProjects';
import { ProjectsList } from './ProjectsList';
import { ProjectsPageBody } from './ProjectsPageBody';
import { useEffect } from 'react';
import { MIGRATION_UPDATE } from '../../../../utils/EventEmitter';

/**
 * Page for looking projects list
 * @returns {*}
 * @constructor
 */
export const ProjectsPage = () => {
	const [folderId, , { page, q, orderBy, sortOrder }] = useProjectGroupRoute();
	const [
		projects,
		,
		{ loading: projectsLoading, error, refetch: refetchProjects },
	] = useProjects({
		search: q,
		page: parseInt(page),
		project_group_id: folderId,
		orderBy,
		sortOrder,
	});

	// Loading the folders into cache so we can just query cache on the project components
	// const { loading: foldersLoading, error: foldersError } = useQuery(GET_PROJECT_GROUPS);
	const [
		projectGroups,
		,
		{ loading: foldersLoading, refetch: refetchProjectGroups },
	] = useProjectGroups();

	// useEffect(() => {
	// 	(async function () {
	// 		await refetchProjects();
	// 		await refetchProjectGroups();
	// 	})();
	// }, [refetchProjects, refetchProjectGroups]);
	
	const refetch = () => {
		refetchProjects();
		refetchProjectGroups();
	};

	useEffect(() => {
		window.addEventListener(MIGRATION_UPDATE, refetch);
		return () => {
			window.removeEventListener(MIGRATION_UPDATE, refetch);
		}
	}, [refetchProjects, refetchProjectGroups]);

	 

	if (error)
		return (
			<ProjectsPageBody>
				<ErrorMessage error={error} />
			</ProjectsPageBody>
		);

	const loading = projectsLoading || foldersLoading;
	
	return (
		<ProjectsPageBody
			paginatorInfo={projects?.paginatorInfo || {}}
			loading={loading}
			foldersLoading={foldersLoading}
			projectGroups={projectGroups}
			projectsLoading={loading}
		>
			{
				!loading && projects?.data.length == 0 
				? 
					<NoProjects /> 
				: 
					<ProjectsList
						projects={projects?.data}
						loading={loading}
						refetchProjects={refetch}
					/>
			}
		</ProjectsPageBody>
	);
};
