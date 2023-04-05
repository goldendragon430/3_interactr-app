import React from 'react';
import PropTypes from 'prop-types';

import { PageBody } from 'components';
import { useProjectGroupRoute } from 'modules/project/routeHooks';
import { ProjectsPageMeta } from './ProjectsPageMeta';
import { ProjectsPagePaginator } from './ProjectsPagePaginator';
import { ProjectsPageHeader } from './ProjectsPageHeader';

import styles from '../ProjectsPage.module.scss';

/**
 * @param children
 * @param paginatorInfo
 * @param projectsLoading
 * @param foldersLoading
 * @returns {*}
 * @constructor
 */
export const ProjectsPageBody = ({
	children,
	paginatorInfo,
	projectsLoading,
	foldersLoading,
	loading,
	projectGroups,
}) => {
	const [folderId, setGroupParams] = useProjectGroupRoute();
	
	return (
		<PageBody
			customHeader={
				<ProjectsPageHeader
					meta={
						<ProjectsPageMeta
							projectGroups={projectGroups}
							projectsLoading={projectsLoading}
							foldersLoading={foldersLoading}
							loading={loading}
						/>
					}
				/>
			}
		>
			<div className={styles.wrapper}>{children}</div>
			<div className={styles.paginationStyles}>
				{paginatorInfo && (
					<ProjectsPagePaginator
						paginatorInfo={paginatorInfo || {}}
						onChange={(page) => setGroupParams(folderId, { page })}
					/>
				)}
			</div>
		</PageBody>
	);
};

ProjectsPageBody.propTypes = {
	paginatorInfo: PropTypes.object.isRequired,
	projectsLoading: PropTypes.bool.isRequired,
	loading: PropTypes.bool.isRequired,
	projectGroups: PropTypes.array.isRequired,
};
