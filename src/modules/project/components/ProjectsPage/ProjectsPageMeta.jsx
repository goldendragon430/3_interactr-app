import React from 'react';
import PropTypes from 'prop-types';
import sortBy from 'lodash/sortBy';
import { motion } from 'framer-motion';

import { projectsPath } from '../../routes';
import { useAuthUser } from '@/graphql/User/hooks';
import { useProjectGroupRoute } from 'modules/project/routeHooks';
import { setBreadcrumbs } from '@/graphql/LocalState/breadcrumb';
import {
	animationState,
	preAnimationState,
	transition,
} from 'components/PageBody';
import { ProjectsPageSubNav } from './ProjectsPageSubNav';
import { ProjectPageFilters } from './ProjectsPageFilters';

const DEFAULT_PROJECT_CRUMBS = [
	{ text: 'Projects', link: projectsPath() },
	{ text: 'No Folder', link: projectsPath() },
];


const LEGACY_PROJECT_CRUMBS = [
	{ text: 'Projects', link: projectsPath() },
	{ text: 'Legacy Folder', link: projectsPath() },
];
/**
 * List project folders list in header
 * @returns {boolean|*}
 * @constructor
 */
export const ProjectsPageMeta = ({
	projectsLoading,
	loading,
	projectGroups,
}) => {
	const user = useAuthUser();
	const [folderId, setGroupParams] = useProjectGroupRoute();

	if (folderId === null) {
		setBreadcrumbs(DEFAULT_PROJECT_CRUMBS);
	}

	if (folderId === -1) {
		setBreadcrumbs(LEGACY_PROJECT_CRUMBS);
	}

	const firstNavItem = {
		id: 0,
		active: folderId === null,
		text: 'No Folder',
		action() {
			setGroupParams(0, {});
		},
	};

	const legacyNavItem = {
		id: -1,
		active: folderId === -1,
		text: 'Legacy Folder',
		action() {
			setGroupParams(-1, {});
		},
	};

	const folders =
		projectGroups &&
		projectGroups.map((folder) => {
			if (parseInt(folder.id) === parseInt(folderId)) {
				setBreadcrumbs([
					{ text: 'Projects', link: projectsPath() },
					{ text: folder.title, link: projectsPath(folder.id) },
				]);
			}

			return {
				id: folder.id,
				active: parseInt(folder.id) === parseInt(folderId),
				text: `${folder.title} (${folder.projects_count})`,
				sort_order: folder.sort_order,
				action() {
					setGroupParams(parseInt(folder.id), { page: 1 });
				},
			};
		});

	const { parent_user_id } = user;
	const sortedFolders = sortBy(folders, ['sort_order']);

	// This is the only best place to update breadcrumbs for projects page
	return (
		!parent_user_id && (
			<motion.div
				exit={preAnimationState}
				initial={preAnimationState}
				animate={animationState}
				transition={transition}
			>
				<ProjectsPageSubNav
					items={[legacyNavItem, firstNavItem, ...sortedFolders]}
					loading={loading}
					verticalFoldersScroll
				/>
				<ProjectPageFilters
					parent_user_id={parent_user_id}
					projectsLoading={projectsLoading}
				/>
			</motion.div>
		)
	);
};

ProjectsPageMeta.propTypes = {
	projectsLoading: PropTypes.bool.isRequired,
	loading: PropTypes.bool.isRequired,
	projectGroups: PropTypes.array.isRequired,
};
