import React from 'react';
import PropTypes from 'prop-types';

import { SelectInput } from 'components/PropertyEditor';
import SelectAsyncInput from "components/SelectAsyncInput";
import { useMediaLibraryProjects } from '../utils';

import styles from 'modules/project/components/ProjectsPage.module.scss';

/**
 * List project items in dropdown with lazy scroll loading
 * @param projectId
 * @param onChange
 * @returns {*}
 * @constructor
 */
export const ProjectsSelectorDropdown = ({ projectId, onChange }) => {
	const [getProjects, { projects, nextPageUrl }] = useMediaLibraryProjects();

	const projectsSelectList = () => {
		const defaultOption = [
			{ label: 'All Projects', value: 0, clearableValue: false },
		];
		const data = projects.map((item) => ({
			label: item.title,
			value: item.id
		}));
		return [...defaultOption, ...data];
	};

	const handleProjectsLazyLoad = () => {
		// List more projects on mouse scroll if pagination is still not over
		if (nextPageUrl) {
			getProjects(nextPageUrl, { customRootUrl: true });
		}
	};

	return (
		<>
			<div>
				<label style={{ paddingTop: '5px' }}>Filter By Project</label>
			</div>
			<div className={styles.sortOptions}>
				<SelectAsyncInput
					options={projectsSelectList()}
					value={parseInt(projectId)}
					onChange={onChange}
					onLazyLoad={handleProjectsLazyLoad}
				/>
			</div>
		</>
	);
};

ProjectsSelectorDropdown.propTypes = {
	projectId: PropTypes.string.isRequired,
	onChange: PropTypes.func.isRequired,
};
