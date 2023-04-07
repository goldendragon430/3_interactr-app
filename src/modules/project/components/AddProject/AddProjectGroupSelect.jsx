import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/client';

import { ErrorMessage, Icon } from 'components';
import { recreateSelectOptions } from 'utils';
import { Option, SelectInput } from 'components/PropertyEditor';

const PROJECT_GROUPS_QUERY = gql`
	query projectGroups {
		result: projectGroups {
			id
			title
		}
	}
`;

/**
 * Shows a select list of all the users projects
 * @param state
 * @param setState
 * @returns {JSX.Element}
 * @constructor
 */
export const AddProjectGroupSelect = ({ state, setState }) => {
	const { data, loading, error } = useQuery(PROJECT_GROUPS_QUERY);

	const { project_group_id } = state;

	if (loading) return <Icon loading />;

	if (error) return <ErrorMessage error={error} />;

	const groupSelectOptions = () => {
		return recreateSelectOptions(
			data.result,
			{ key: 'id', label: 'title' },
			{ key: 'noFolder', value: 'No Folder' }
		);
	};

	return (
		<div className='form-control'>
			<Option
				label='Add to Folder'
				name='folder'
				value={project_group_id}
				Component={SelectInput}
				options={groupSelectOptions()}
				onChange={(val) => setState({ project_group_id: parseInt(val) ? parseInt(val) : null })}
			/>
		</div>
	);
};

AddProjectGroupSelect.propTypes = {
	state: PropTypes.object.isRequired,
	setState: PropTypes.func.isRequired,
};
