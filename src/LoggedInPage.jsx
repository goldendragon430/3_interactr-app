import { useEffect, useState } from 'react';
import Pusher from 'pusher-js';
import {
	Routes,
	Route,
	Navigate,
	useLocation,
} from 'react-router-dom';

import AccountOverview from 'modules/account/components/AccountOverview';
import AgencyPage from 'modules/agency/components/AgencyPage';
import ConsultantKitPage from 'modules/agency/components/ConsultantKitPage';
import AddProjectPage from 'modules/project/components/AddProjectPage';
import { ProjectsPage } from 'modules/project/components/ProjectsPage';
import ProjectOverview from 'modules/project/components/ProjectOverview';
// import StatsListPage from 'modules/stat/components/StatsListPage';

import AdminOverview from './modules/admin/components/AdminOverview';
import Page from 'components/Page';
import TrainingPage from 'modules/training/components/TrainingPage';
import MasterclassPage from 'components/MasterclassPage';
import UpgradePage from './UpgradePage';
import AccountCustomEmailLists from './modules/account/components/AccountCustomEmailLists';
import CustomListsPage from './modules/account/components/CustomListsPage';
import SurveysPage from './modules/project/components/Surveys/SurveysPage';
import DashboardPage from './modules/dashboard/components/DashboardPage';

import showUpdateMessage from 'utils/showGlobalMessage';
import PageLoader from './components/PageLoader';
import styles from './components/PageBody.module.scss';
import DashboardSidebar from './components/Sidebar/DashboardSidebar';
import AgencyOverview from './modules/agency/components/AgencyOverview';
import TrainingOverview from './modules/training/components/TrainingOverview';
import { projectsPath } from './modules/project/routes';
import { dashboardPath } from './modules/dashboard/routes';
import { agencyRoute } from './modules/agency/routes';
import { trainingRoute } from './modules/training/routes';
import { accountRoute } from './modules/account/routes';
import Modal from 'components/Modal';
import Button from './components/Buttons/Button';
import { phpApi } from './utils/apis';
import { adminPagePath } from './modules/user/routes';
import { cache } from './graphql/client';
import { MediaLibraryPage } from './modules/media/components/MediaLibraryPage/MediaLibraryPage';
import PreviewProjectModal from './modules/project/components/PreviewProjectModal';
import EmbedCodeModal from './modules/project/components/EmbedCodeModal';
import { AddProjectModal } from './modules/project/components/AddProject';
// import AddMediaModals from './modules/media/components/AddMediaModals';
import { UploadUserAvatarModal } from './modules/account/components/UpdateUserAvatarModal';
import mapValues from 'lodash/mapValues';
import { GET_AUTH_USER } from './graphql/User/queries';
import { useQuery, useReactiveVar } from '@apollo/client';
import { getAcl, setAcl } from './graphql/LocalState/acl';
import ErrorMessage from './components/ErrorMessage';
import { errorAlert } from './utils/alert';
import {
	EditMediaModal,
	ReplaceMediaSourceModal,
} from 'modules/media/components';
import SelectPopupModals from 'modules/modal/components/SelectPopup/SelectPopupModals';
import { toast } from "react-toastify";

// const StatsListPage = React.lazy(() =>
//   import(/* webpackChunkName:'statsPage' */ 'modules/stat/components/StatsListPage')
// );
// const VideosPage = React.lazy(() =>
//   import(/* webpackChunkName:'videosPage' */ 'modules/media/components/VideosPage')
// );

const LoggedInPage = () => {
	const { data, loading, error } = useQuery(GET_AUTH_USER);

	const acl = useReactiveVar(getAcl);

	useEffect(() => {
		if (data && data.result) {
			setAcl(data.result);
		}
	}, [data]);

	if (loading) return <PageLoader />;

	if (error) {
		console.error(error);
		return <ErrorMessage error={error} />;
	}
	
	if (error || !data.result) {
		let redirectUrl = location.pathname;

		if (location.search) {
			redirectUrl += location.search;
		}
		return (
			<Navigate
				to={{
					pathname: '/login',
					search: `?redirect=${encodeURIComponent(redirectUrl)}`,
				}}
			/>
		);
	}

	const { result: user } = data;

	// authUserId prop is set to the auth user when user acl has been processed
	if (!acl.authUserId) return <PageLoader />;

	if (!user.upgraded) {
		return <UpgradeMessage userId={user.id} />;
	}

	useEffect(() => {
		console.log('Pusher initialized...')
		plugPusher(user);
	}, []);
	
	return (
		<div className={styles.wrapper}>
			{/* <TopNav {...this.props}/> */}
			<DashboardSidebar />

			{/*
				All the modals here are used a lot so the show / hide status is managed
				by a local state var
			*/}
			<PreviewProjectModal />
			<EmbedCodeModal />
			<AddProjectModal />
			{/* <AddMediaModals /> */}
			<EditMediaModal />
			<ReplaceMediaSourceModal />
			<UploadUserAvatarModal />
			<SelectPopupModals />

			<Routes>
				{/* <Route path={adminPagePath()} component={AdminOverview} /> */}

				{/* Dashboard */}
				<Route path='/dashboard' element={<DashboardPage/>} />

				{/* Projects Pages */}
				<Route path='/projects/add/:activeTab' element={<AddProjectPage/>} />
				<Route path='/projects/:projectId/*' element={<ProjectOverview/>} />
				<Route path='/projects/folder/:groupId/*' element={<ProjectsPage />} />
				<Route path='/projects' element={<ProjectsPage />} />

				<Route path='/media' element={ <MediaLibraryPage />} />

				<Route path={agencyRoute()} element={<AgencyOverview/> } />
				<Route path={trainingRoute()} element={ <TrainingOverview /> } />
				<Route path={accountRoute()} element={ <AccountOverview/> } />
				<Route path='/upgrade' element={<UpgradePage />} />
				{/* Set the home for users and subusers */}				
				<Route path='/' element={<RedirectPage isSubUser={acl.isSubUser} />} />
			</Routes>
		</div>
	);
};
export default LoggedInPage;

const RedirectPage = ({isSubUser}) => {
	return (
		isSubUser ?  <Navigate to="/projects" replace={true} /> :  <Navigate to="/dashboard" replace={true} />
	)
}

const UpgradeMessage = ({ userId }) => {
	const [loading, setLoading] = useState(false);

	const handleClick = async () => {
		setLoading(true);
		try {
			await phpApi(`update/20`);

			cache.modify({
				id: 'User:' + userId,
				fields: {
					upgraded() {
						return 1;
					},
				},
			});
		} catch (err) {
			console.error(err);
			errorAlert({ text: 'Unable to upgrade user' });
		}

		setLoading(false);
	};

	return (
		<Modal 
			height={360} 
			show={true} 
			width={400}
			heading={
				<>
					Welcome to Interactr v2.0!
				</>
			}
			enableFooter={false}
		>
			<div style={{ textAlign: 'center' }}>
				<h2>Welcome to Interactr Version 2.0</h2>
				<p>
					This is a major update to the interactr platform so before you can get
					started we need to make some updates to the projects in your account.
				</p>
				<p>
					This will not affect any of your published projects. Click the button
					below to get started.
				</p>
				<div style={{ marginLeft: '70px', marginTop: '30px' }}>
					<Button
						icon='arrow-up'
						loading={loading}
						onClick={handleClick}
						primary
					>
						Upgrade My Account Now
					</Button>
				</div>
			</div>
		</Modal>
	);
};

const plugPusher = (user) => {
	const pusher = new Pusher(
		import.meta.env.VITE_PUSHER_SERVER, // dev server's pusher and production's pusher respectively
		// 'dd2f03b261d055ae0507', // dev server's pusher and production's pusher respectively
		{ cluster: 'eu' }
	);

	// Only log to console when in dev we don;t want todo this in production
	//pusher.logToConsole = (__DEV__);
	pusher.logToConsole = true;

	const media = pusher.subscribe('media_' + user.id);

	media.bind('update', (response) => {
		const fieldsToUpdate = mapValues(response.data, (k) => {
			return () => {
				return k;
			};
		});

		const cacheKey = cache.identify({ id: response.id, __typename: 'Media' });

		cache.modify({
			id: cacheKey,
			fields: fieldsToUpdate,
		});
	});

	const bunnyCdnVideo = pusher.subscribe('bunny_cdn_video_' + user.id);

	bunnyCdnVideo.bind('update', (response) => {
		const fieldsToUpdate = mapValues(response.data, (k) => {
			return () => {
				return k;
			};
		});

		const cacheKey = cache.identify({
			id: response.id,
			__typename: 'BunnyCdnVideo',
		});

		cache.modify({
			id: cacheKey,
			fields: fieldsToUpdate,
		});
	});

	const migration = pusher.subscribe('migration_' + user.id);
	migration.bind('started', (res) => {
		const message = `Migration of project "${res.project_title}" has been started.`;
		toast.info(message, {
			position: 'top-right',
			theme:"colored",
		});
	})

	migration.bind('processing', (res) => {
		const message = `Project "${res.project_title}" is being migrated now.`;
		toast.info(message, {
			position: 'top-right',
			theme:"colored",
		});
	})

	migration.bind('completed', (res) => {
		const message = `Project "${res.project_title}" has been migrated successfully.`;
		toast.success(message, {
			position: 'top-right',
			theme:"colored"
		});
	})

	migration.bind('error', (res) => {
		const message = `Project "${res.project_title}" Migration Error:  ${res.message}`;
		toast.error(message, {
			position: 'top-right',
			theme:"colored"
		});
	})
};