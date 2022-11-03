import React from 'react';
import { Routes, Route, useParams } from 'react-router-dom';
import { toRoutePath } from '@/routeBuilders';
import { useQuery } from '@apollo/client';
import { GET_PROJECT } from '../../../graphql/Project/queries';
import AdminPage from './AdminPage';
import PublishProjectPage from './PublishProjectPage';
import ProjectSettingsPage from './ProjectSettingsPage';
import ProjectCanvasPage from './ProjectCanvasPage';
import SharingProjectPage from './ProjectSharingPage/SharingProjectPage';
import ProjectChaptersPage from './ProjectChapters';
import { NodePage } from 'modules/node/components/NodePage';
import LoadableProjectStatsPage from 'modules/project/components/ProjectStatsPage';
import {
	projectChaptersPage,
	projectPlayerPath,
	projectSettingsPath,
	projectSharingPage,
	projectStatsPath,
	projectSurveyPath,
	publishProjectPath,
	adminPagePath,
} from '../routes';
import PageBody from '../../../components/PageBody';
import ProjectSubNav from './ProjectSubNav';
import { useProject } from '../../../graphql/Project/hooks';
import ErrorMessage from '../../../components/ErrorMessage';
import Icon from '../../../components/Icon';
import { ProjectButtons, ProjectHeading } from './ProjectPage';
import ProjectPlayerPage from './ProjectPlayerPage';
import SurveysPage from './Surveys/SurveysPage';
import { interactionPath } from '../../interaction/routes';
import {
	modalElementPath,
	modalPath,
	modalsPath,
} from '../../modal/routes';
import { nodePath } from '../../node/routes';
import { elementGroupPath } from '../../element/routes';
import { ModalsPage } from 'modules/modal/components/ModalsPage';
import AddMediaModal from '../../media/components/AddMediaModals';
import NotFoundPage from 'components/NotFoundPage';
import { useReactiveVar } from '@apollo/client';
import { getAcl } from '../../../graphql/LocalState/acl';
import { MediaLibraryContainer } from 'modules/media/components/mediaLibrarySidebar';

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
