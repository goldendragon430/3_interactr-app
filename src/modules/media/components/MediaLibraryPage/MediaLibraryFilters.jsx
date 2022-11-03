import React, { useState } from 'react';
import cx from 'classnames';

import { Icon } from 'components';
import { Option, SelectInput, TextInput } from 'components/PropertyEditor';
import { ProjectsSelectorDropdown } from '../ProjectsSelectorDropdown';
import { MediasTypeSelectorDropdown } from '../MediasTypeSelectorDropdown';
import { useVideosPageRoute } from '../../routeHooks';

import filterInputStyles from 'components/FilterInput.module.scss';
import styles from 'modules/project/components/ProjectsPage.module.scss';

const filterOptions = () => {
	return [
		{
			label: 'Video Name',
			value: 'name',
			clearableValue: false,
		},
		{
			label: 'Uploaded Date',
			value: 'created_at',
			clearableValue: false,
		},
	];
};

/**
 * Render media library video filters
 * @returns {*}
 * @constructor
 */
export const MediaLibraryFilters = () => {
	const [search, setSearch] = useState('');
	const [{ orderBy, project_id, filterBy }, setVideosPageParams] =
		useVideosPageRoute();

	return (
		<div className={cx(styles.filterRow, 'grid')}>
			<div className={cx(styles.filterRow_sortBy, 'col12')}>
				<div
					className={filterInputStyles.wrapper}
					style={{ marginBottom: '25px' }}
				>
					<Option
						Component={TextInput}
						style={{ width: '100%', marginBottom: 0 }}
						value={search}
						placeholder='Search videos...'
						onChange={setSearch}
						onKeyPress={(e) =>
							e.key === 'Enter'
								? setVideosPageParams({ q: e.target.value, filterBy })
								: null
						}
					/>
					<Icon
						name='search'
						onClick={() =>
							setVideosPageParams({
								q: search,
								orderBy,
								sortOrder: ['name', 'project_title'].includes(orderBy)
									? 'ASC'
									: 'DESC',
								project_id,
								filterBy,
							})
						}
					/>
				</div>
			</div>
			<div
				className={cx(styles.filterRow_sortBy, 'col12')}
				style={{ marginBottom: '20px' }}
			>
				<label style={{ paddingTop: '5px' }}>Sort By</label>
				<Option
					Component={SelectInput}
					value={orderBy}
					className={styles.sortOptions}
					options={filterOptions()}
					onChange={(value) =>
						setVideosPageParams({
							q: search,
							orderBy: value,
							sortOrder: ['name', 'project_title'].includes(value)
								? 'ASC'
								: 'DESC',
							project_id,
						})
					}
					clearable={false}
					searchable={false}
				/>
			</div>
			<div
				className={cx(styles.filterRow_sortBy, 'col12')}
				style={{ marginBottom: '20px' }}
			>
				<ProjectsSelectorDropdown
					projectId={project_id}
					onChange={(project_id) => {
						setVideosPageParams({
							q: search,
							orderBy,
							sortOrder: ['name', 'project_title'].includes(orderBy)
								? 'ASC'
								: 'DESC',
							project_id,
						});
					}}
				/>
			</div>
			<div className={cx(styles.filterRow_sortBy, 'col12')}>
				<MediasTypeSelectorDropdown
					filterBy={filterBy}
					onChange={(filterBy) => {
						setVideosPageParams({
							q: search,
							orderBy,
							sortOrder: ['name', 'project_title'].includes(orderBy)
								? 'ASC'
								: 'DESC',
							filterBy,
						});
					}}
				/>
			</div>
		</div>
	);
};
