import React from 'react';
import PropTypes from 'prop-types';

import { useMediaLibraryProjects } from '../utils';
import { SelectInput } from 'components/PropertyEditor';

import styles from 'modules/project/components/ProjectsPage.module.scss';

/**
 * List project items in dropdown with lazy scroll loading
 * @param projectId
 * @param onChange
 * @returns {*}
 * @constructor
 */
export const MediasTypeSelectorDropdown = ({
	filterBy,
	onChange,
	inline = false,
	label = 'Filter By Media Type',
}) => {
	if (inline) {
		return (
			<div className={'grid'}>
				<div className={'col5 text-right'} style={{ paddingRight: 0 }}>
					<label style={{ marginTop: 10 }}>{label}</label>
				</div>
				<div className={'col7'} style={{ paddingRight: 0 }}>
					<DropDown filterBy={filterBy} onChange={onChange} />
				</div>
			</div>
		);
	}

	return (
		<>
			<div>
				<label>{label}</label>
			</div>
			<DropDown filterBy={filterBy} onChange={onChange} />
		</>
	);
};

MediasTypeSelectorDropdown.propTypes = {
	filterBy: PropTypes.string.isRequired,
	inline: PropTypes.bool,
	label: PropTypes.string,
	onChange: PropTypes.func.isRequired,
};

const DropDown = ({ filterBy, onChange }) => {
	const [getProjects, { nextPageUrl }] = useMediaLibraryProjects();

	const projectsTypeSelectList = () => {
		const defaultOption = [{ label: 'All', value: 'all', clearableValue: false }];

		const options = [
			{ label: 'Videos', value: 0, clearableValue: true },
			{ label: 'Images', value: 1, clearableValue: true },
		];

		return [...defaultOption, ...options];
	};

	const handleProjectsTypeLazyLoad = () => {
		// List more projects on mouse scroll if pagination is still not over
		if (nextPageUrl) {
			getProjects(nextPageUrl, { customRootUrl: true });
		}
	};

	return (
		<div className={styles.sortOptions}>
			<SelectInput			
				options={projectsTypeSelectList()}
				value={filterBy}
				onChange={onChange}
			/>
		</div>
	);
};

DropDown.propTypes = {
	filterBy: PropTypes.string.isRequired,
	onChange: PropTypes.func.isRequired,
};
