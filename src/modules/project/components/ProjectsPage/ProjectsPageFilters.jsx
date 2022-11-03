import React, { useState } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import { Icon } from 'components';
import { Option, SelectInput, TextInput } from 'components/PropertyEditor';
import { AddProjectButton } from '../AddProjectButton';
import { ProjectGroupsButton } from '../ProjectGroupsButton';
import { useProjectGroupRoute } from 'modules/project/routeHooks';

import styles from '../ProjectsPage.module.scss';
import filterInputStyles from 'components/FilterInput.module.scss';

const filterOptions = {
	is_favourite: 'Order By Favourites',
	title: 'Order By Name',
	created_at: 'Order By Created Date'
};

// const filterOptions = [
// 	{
// 		label: 'Order By Favourites',
// 		value: 'is_favourite',
// 		clearableValue: false,
// 	},
// 	{
// 		label: 'Order By Name',
// 		value: 'title',
// 		clearableValue: false,
// 	},
// 	{
// 		label: 'Order By Created Date',
// 		value: 'created_at',
// 		clearableValue: false,
// 	},
// ];

/**
 * Use search/orderBy inputs to filter projects with
 * @param parent_user_id
 * @param projectsLoading
 * @returns {*}
 * @constructor
 */
export const ProjectPageFilters = ({ parent_user_id, projectsLoading }) => {
	const [folderId, setGroupParams, queryParams] = useProjectGroupRoute();
	const { q, orderBy } = queryParams;
	const [search, setSearch] = useState(q);

	const updateProjectsList = (options = {}) => {
		setGroupParams(folderId, { ...options });
	};
	
	return (
		<div className='mt-1'>
			<div className={cx(styles.topOptions, 'flex')}>
				<div className={cx(styles.filterRow_search)}>
					{!parent_user_id && <AddProjectButton />}
					{!parent_user_id && <ProjectGroupsButton />}
				</div>
				<div className={cx(styles.filterRow_sortBy, 'flex-8')}>
					<div className={filterInputStyles.wrapper}>
						<TextInput
							value={search}
							placeholder='Search projects...'
							onChange={(search) => setSearch(search)}
							disabled={projectsLoading}
							onKeyPress={({ key }) =>
								key === 'Enter' ? updateProjectsList({ q: search }) : null
							}
						/>
						<Icon
							name='search'
							// loading={projectsLoading}
							onClick={() => updateProjectsList({ q: search })}
						/>
					</div>
					<Option
						Component={SelectInput}
						value={orderBy}
						options={filterOptions}
						disabled={projectsLoading}
						// isLoading={projectsLoading}
						onChange={(value) => {
							const options = { orderBy: value, sortOrder: 'ASC' };

							if (value === 'is_favourite' || value === 'created_at') {
								options.sortOrder = 'DESC';
							}

							return updateProjectsList(options);
						}}
						clearable={false}
						searchable={false}
						placeholder='Order By'
						className={styles.sortOptions}
					/>
				</div>
			</div>
		</div>
	);
};

ProjectPageFilters.propTypes = {
	parent_user_id: PropTypes.number.isRequired,
	projectsLoading: PropTypes.bool.isRequired,
};
