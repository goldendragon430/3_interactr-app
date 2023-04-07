import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import map from 'lodash/map';
import reduce from 'lodash/reduce';
import cx from 'classnames';
import { motion } from 'framer-motion';

import { ErrorMessage } from 'components';
import { useSetState } from 'utils/hooks';
import { NoProjects } from './NoProjects';
import ProjectCard from '../ProjectCard';
import ProjectsLoading from '../ProjectsLoading';
import { fetchStats } from 'modules/dashboard/components/DashboardPage';

import styles from '../ProjectsPage.module.scss';

/**
 * Project cards list
 * @param projects
 * @param refetch
 * @param loading
 * @returns {Array|*}
 * @constructor
 */
export const ProjectsList = ({ projects, loading, refetchProjects }) => {
	const [state, setState] = useSetState({
		loadingStats: true,
		errorStats: false,
		data: {},
	});

	useEffect(() => {
		if (!loading) {
			(async () => {
				try {
					const projectIds = reduce(
						projects,
						(result, project) => {
							return result.concat([parseInt(project.id)]);
						},
						[]
					);

					const data = await fetchStats(projectIds);

					setState({
						loadingStats: false,
						data,
					});
				} catch (err) {
					setState({
						loadingStats: false,
						errorStats: err,
					});
				}
			})();
		}
	}, [loading, projects]);

	const { loadingStats, data, errorStats } = state;
	
	if (loading || loadingStats) {
		return <ProjectsLoading  />;
	}

	if (errorStats) {
		return <ErrorMessage error={errorStats} />;
	}

	const list = {
		hidden: { opacity: 0 },
		show: {
			opacity: 1,
			transition: {
				staggerChildren: 0.2,
			},
		},
	};

	const item = {
		hidden: { opacity: 0, x: -5, scale: 0.7 },
		show: { opacity: 1, x: 0, scale: 1, transition: { type: 'ease-in' } },
	};

	return (
		<motion.div initial='hidden' animate='show' variants={list} style={{display: projects.length ? 'inline-block': 'inline'}}>
			{map(projects, (project) => (
				<motion.article
					variants={item}
					className={cx('cards_card', styles.projectCard)}
					key={'project_list_article' + project.id}
				>
					<ProjectCard
						project={project}
						key={project.id}
						refetchProjects={refetchProjects}
						currentImpressions={data.project_impressions_current[project.id]}
						previousImpressions={data.project_impressions_previous[project.id]}
						currentPlays={data.project_views_current[project.id]}
						previousPlays={data.project_views_previous[project.id]}
					/>
				</motion.article>
			))}
			{projects.length === 0 ? <NoProjects /> : null}
		</motion.div>
	);
};

ProjectsList.propTypes = {
	projects: PropTypes.array.isRequired,
	loading: PropTypes.bool.isRequired,
};
