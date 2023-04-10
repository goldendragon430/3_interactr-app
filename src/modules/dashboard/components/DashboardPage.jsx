import React, { useEffect, useState } from 'react';
import PageBody, {
	animationState,
	preAnimationState,
	transition,
} from 'components/PageBody';
import Button from 'components/Buttons/Button';
import { useAuthUser } from '../../../graphql/User/hooks';
import ErrorMessage from '../../../components/ErrorMessage';
import {
	getBreadcrumbs,
	setBreadcrumbs,
} from '../../../graphql/LocalState/breadcrumb';
import { addProjectPath, projectsPath } from '../../project/routes';
import WelcomeMessage from './WelcomeMessage';
import LinkButton from '../../../components/Buttons/LinkButton';
import { useQuery, useReactiveVar } from '@apollo/client';
import DashboardCards from './DashboardCards';
import gql from 'graphql-tag';
import ProjectViewsByLocationChart from './Charts/ProjectViewsByLocationChart';
import styles from './DashboardPage.module.scss';
import Icon from '../../../components/Icon';
import { ViewsByDevice } from './Charts';
import DashboardLoader from './DashboardLoader';
import { useSetState } from '../../../utils/hooks';
import reduce from 'lodash/reduce';
import moment from 'moment';
import analytics from '../../../utils/analytics';
import { isValidNumber, percentage } from '../../../utils/numberUtils';
import ProjectsViewsByAll from './Charts/ProjectsViewsByAll';
import map from 'lodash/map';
import ProjectPerformanceItem from './ProjectPerformanceItem';
import { motion, AnimatePresence } from 'framer-motion';
import WhatsNewSummaryBox from './WhatsNewSummaryBox';
import NeedHelpBox from './NeedHelpBox';
import { getAcl } from '../../../graphql/LocalState/acl';
import { delay } from 'utils/timeUtils';
import { useProjectGroups } from '@/graphql/ProjectGroup/hooks';

const QUERY = gql`
	query allProjects {
		result: allProjects(limit: 10) {
			id
			title
			created_at
			image_url
			storage_path
			project_group_id
		}
	}
`;
export default function DashboardPage() {
	const acl = useReactiveVar(getAcl);

	const user = useAuthUser();

	const { data, loading, error } = useQuery(QUERY);

	const [
		projectGroups,
		,
		{ loading: foldersLoading, refetch: refetchProjectGroups },
	] = useProjectGroups();

	useEffect(() => {
		setBreadcrumbs([{ text: 'Dashboard' }]);
	}, []);

	/** Dashboard page is not accessible for sub users */
	if (acl.isSubUser) {
		window.location.href = projectsPath();
	}

	/** Prevents the user getting a flash of the interactr dashboard before the user is loaded in */
	if (loading || foldersLoading)
		return (
			<div style={{ padding: 30 }}>
				<Icon loading />
			</div>
		);

	if (error) {
		return <ErrorMessage error={error} />;
	}
	return (
		<PageBody heading={'Your Dashboard'}>
			<div
				style={{ marginLeft: '20px', width: '1280px', marginBottom: '30px' }}
				className='mb-2'
			>
				<div className='grid' style={{ marginBottom: '20px' }}>
					<div className='col6'>
						<WelcomeMessage user={user} />
					</div>
					<div className='col6'>
						<LinkButton to={addProjectPath()} primary right icon={'plus'} large>
							Create a New Project
						</LinkButton>
						<Button
							secondary
							right
							icon={'life-ring'}
							large
							onClick={() => Beacon('open')}
						>
							Support
						</Button>
					</div>
				</div>
				<DashboardData projects={data.result} projectGroups={projectGroups} />
			</div>
		</PageBody>
	);
}

const DashboardData = ({ projects, projectGroups }) => {
	const [state, setState] = useSetState({
		loading: true,
		error: false,
		data: {},
		projectIds: reduce(
			projects,
			(result, project) => {
				return result.concat([parseInt(project.id)]);
			},
			[]
		),
	});
	
	useEffect(() => {
		(async () => {
			// A small delay here allows the loader to animate in nicely before we do anything
			await delay(2000);

			try {
				const data = await fetchStats(state.projectIds);
				
				setState({
					loading: false,
					data,
				});
			} catch (err) {
				setState({
					loading: false,
					error: err,
				});
			}
		})();
	}, []);

	const { loading, data, error } = state;

	if (loading) return <DashboardLoader />;

	if (error) return <ErrorMessage error={error} />;

	return (
		<AnimatePresence>
			<motion.div
				exit={preAnimationState}
				initial={preAnimationState}
				animate={animationState}
				transition={transition}
			>
				<DashboardCards
					all_project_impressions_current={data.all_project_impressions_current}
					all_project_impressions_previous={
						data.all_project_impressions_previous
					}
					all_project_plays_current={data.all_project_plays_current}
					all_project_plays_previous={data.all_project_plays_previous}
					all_project_interactions_current={
						data.all_project_interactions_current
					}
					all_project_interactions_previous={
						data.all_project_interactions_previous
					}
					all_project_playrate_current={data.all_project_playrate_current}
					all_project_playrate_previous={data.all_project_playrate_previous}
				/>

				<ProjectsViewsByAll
					title='Project Views By Day'
					data={data}
					labels={map(projects, (project) => ({
						title: project.title,
						id: project.id,
					}))}
				/>

				<div className='grid' style={{ marginTop: '30px' }}>
					<div className={'col7'}>
						<h3>Individual Project Performance</h3>
						{map(projects, (project) => (
							<ProjectPerformanceItem
								project={project}
								data={data}
								loading={loading}
								projectGroups={projectGroups}
							/>
						))}
					</div>
					<div className={'col5'}>
						<ViewsByDevice data={data} />

						<ProjectViewsByLocationChart data={data} />

						<NeedHelpBox />

						<WhatsNewSummaryBox />
					</div>
				</div>
			</motion.div>
		</AnimatePresence>
	);
};

export const fetchStats = async (projectIds) => {
	const previousStart = moment().subtract(61, 'day');
	const previousEnd = moment().subtract(31, 'day');
	const currentStart = moment().subtract(30, 'day');
	const currentEnd = moment();

	const DashboardCardQueries = [
		{
			name: 'all_project_impressions_current',
			collection: 'Impression',
			api: 'Interactr',
			filters: {
				project_id: projectIds,
			},
			start_date: currentStart,
			end_date: currentEnd,
		},
		{
			name: 'all_project_impressions_previous',
			collection: 'Impression',
			api: 'Interactr',
			filters: {
				project_id: projectIds,
			},
			start_date: previousStart,
			end_date: previousEnd,
		},
		{
			name: 'all_project_plays_current',
			collection: 'ProjectView',
			api: 'Interactr',
			filters: {
				project_id: projectIds,
			},
			start_date: currentStart,
			end_date: currentEnd,
		},
		{
			name: 'all_project_plays_previous',
			collection: 'ProjectView',
			api: 'Interactr',
			filters: {
				project_id: projectIds,
			},
			start_date: previousStart,
			end_date: previousEnd,
		},
		{
			name: 'all_project_interactions_current',
			collection: 'ElementClick',
			api: 'Interactr',
			filters: {
				project_id: projectIds,
			},
			start_date: currentStart,
			end_date: currentEnd,
		},
		{
			name: 'all_project_interactions_previous',
			collection: 'ElementClick',
			api: 'Interactr',
			filters: {
				project_id: projectIds,
			},
			start_date: previousStart,
			end_date: previousEnd,
		},
	];

	const ProjectViewsChartQuery = reduce(
		projectIds,
		(result, id) => {
			return result.concat({
				name: id,
				collection: 'ProjectView',
				api: 'Interactr',
				filters: {
					project_id: id,
				},
				start_date: currentStart,
				end_date: currentEnd,
				group_by: 'day',
			});
		},
		[]
	);

	const projectPerformanceListQueries = [
		{
			name: 'project_impressions_previous',
			collection: 'Impression',
			api: 'Interactr',
			filters: {
				project_id: projectIds,
			},
			start_date: previousStart,
			end_date: previousEnd,
			group_by: 'project_id',
		},
		{
			name: 'project_impressions_current',
			collection: 'Impression',
			api: 'Interactr',
			filters: {
				project_id: projectIds,
			},
			start_date: currentStart,
			end_date: currentEnd,
			group_by: 'project_id',
		},
		{
			name: 'project_views_previous',
			collection: 'ProjectView',
			api: 'Interactr',
			filters: {
				project_id: projectIds,
			},
			start_date: previousStart,
			end_date: previousEnd,
			group_by: 'project_id',
		},
		{
			name: 'project_views_current',
			collection: 'ProjectView',
			api: 'Interactr',
			filters: {
				project_id: projectIds,
			},
			start_date: currentStart,
			end_date: currentEnd,
			group_by: 'project_id',
		},
	];

	const viewsByDeviceQuery = [
		{
			name: 'mobile',
			collection: 'ProjectViewByDevice',
			api: 'Interactr',
			filters: {
				project_id: projectIds,
			},
			count: 'mobile',
			start_date: currentStart,
			end_date: currentEnd,
		},
		{
			name: 'desktop',
			collection: 'ProjectViewByDevice',
			api: 'Interactr',
			filters: {
				project_id: projectIds,
			},
			count: 'desktop',
			start_date: currentStart,
			end_date: currentEnd,
		},
	];

	const ViewsByLocationQuery = [
		{
			name: 'location',
			collection: 'ProjectViewByLocation',
			api: 'Interactr',
			filters: {
				project_id: projectIds,
			},
			start_date: currentStart,
			end_date: currentEnd,
			distinct: 'country_code',
		},
	];

	const queries = DashboardCardQueries.concat(
		ProjectViewsChartQuery,
		projectPerformanceListQueries,
		viewsByDeviceQuery,
		ViewsByLocationQuery
	);

	let { data } = await analytics.queries(queries);

	data.all_project_playrate_current = percentage(
		data.all_project_plays_current,
		data.all_project_impressions_current
	);
	data.all_project_playrate_previous = percentage(
		data.all_project_plays_previous,
		data.all_project_impressions_previous
	);

	data.mobile = parseInt(data.mobile);
	data.desktop = parseInt(data.desktop);

	data.mobile_percentage = percentage(data.mobile, data.mobile + data.desktop);
	data.desktop_percentage = percentage(
		data.desktop,
		data.mobile + data.desktop
	);

	if (!isValidNumber(data.mobile_percentage)) {
		data.mobile_percentage = '-';
	}

	if (!isValidNumber(data.desktop_percentage)) {
		data.desktop_percentage = '-';
	}

	return data;
};
