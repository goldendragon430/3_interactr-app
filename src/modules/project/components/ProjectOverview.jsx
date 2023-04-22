import { toRoutePath } from '@/routeBuilders';
import { useQuery, useReactiveVar } from '@apollo/client';
import NotFoundPage from 'components/NotFoundPage';
import { MediaLibraryContainer } from 'modules/media/components/mediaLibrarySidebar';
import { ModalsPage } from 'modules/modal/components/ModalsPage';
import { NodePage } from 'modules/node/components/NodePage';
import LoadableProjectStatsPage from 'modules/project/components/ProjectStatsPage';
import React from 'react';
import { Route, Routes, useParams } from 'react-router-dom';
import ErrorMessage from '../../../components/ErrorMessage';
import Icon from '../../../components/Icon';
import PageBody from '../../../components/PageBody';
import { getAcl } from '../../../graphql/LocalState/acl';
import { GET_PROJECT } from '../../../graphql/Project/queries';
import {
	projectChaptersPage
} from '../routes';
import AdminPage from './AdminPage';
import ProjectCanvasPage from './ProjectCanvasPage';
import ProjectChaptersPage from './ProjectChapters';
import { ProjectButtons, ProjectHeading } from './ProjectPage';
import ProjectPlayerPage from './ProjectPlayerPage';
import ProjectSettingsPage from './ProjectSettingsPage';
import SharingProjectPage from './ProjectSharingPage/SharingProjectPage';
import ProjectSubNav from './ProjectSubNav';
import SurveysPage from './Surveys/SurveysPage';

// const LoadableProjectStatsPage = React.lazy(() =>
//   import(/* webpackChunkName: 'ProjectStasPage'*/ 'modules/project/components/ProjectStatsPage')
// );

const ProjectOverview = () => {
	let { projectId } = useParams();

	const { data, loading, error } = useQuery(GET_PROJECT, {
		variables: { projectId },
	});

	if (error) return <ErrorMessage error={error} />;

	if (loading)
		return (
			<div style={{ padding: 30 }}>
				<Icon loading />
			</div>
		);

	const project = data ? data.result : null;

	if (!loading && !project) {
		return <NotFoundPage />;
	}
	
	return (
		<>
			<Routes>
				<Route
					path='/nodes/:nodeId/*'
					element={<NodePages />}
				/>
				<Route path='/*' element={<ProjectPages />} />
			</Routes>
		</>
	);
};
export default ProjectOverview;

const NodePages = () => {
	return (
		<Routes>
			<Route
				path='/interaction/:interactionId/element/:modalElementId'
				element={<NodePage />}
			/>
			<Route
				path='/interaction/:interactionId/element'
				element={<NodePage />}
			/>
			<Route
				path='/interaction/:interactionId'
				element={<NodePage />}
			/>
			<Route
				path='/element-group/:elementGroupId'
				element={<NodePage />}
			/>
			<Route
				index
				element={<NodePage />}
			/>
		</Routes>
	);
};

const ProjectPages = () => {
	return (
		<>
			<PageBody
				subnav={<ProjectSubNav />}
				heading={<ProjectHeading />}
				right={<ProjectButtons />}
			>
				<ProjectPageBody />
			</PageBody>
			<MediaLibraryContainer />
		</>
	);
};

const ProjectPageBody = () => {
	const acl = useReactiveVar(getAcl);
	
	return (
		<Routes>
			{acl && acl.isAdmin && (
				<Route
					path='/admin'
					element={<AdminPage />}
				/>
			)}
			<Route
				path='/settings'
				element={<ProjectSettingsPage />}
			/>
			<Route
				path={toRoutePath(projectChaptersPage, ['projectId'])}
				element={<ProjectChaptersPage />}
			/>
			<Route
				path='/sharing/*'
				element={<SharingProjectPage />}
			/>
			<Route
				path='/analytics/*'
				element={<LoadableProjectStatsPage />}
			/>
			<Route
				path='/player/*'
				element={<ProjectPlayerPage />}
			/>
			<Route
				path='/survey'
				element={<SurveysPage />}
			/>
			<Route
				path='/popups/:modalId/elements/:modalElementId'
				element={<ModalsPage />}
			/>
			<Route
				path='/popups/:modalId'
				element={<ModalsPage />}
			/>
			<Route
				path='/popups'
				element={<ModalsPage />}
			/>
			<Route index element={<ProjectCanvasPage />} />
		</Routes>
	);
};
