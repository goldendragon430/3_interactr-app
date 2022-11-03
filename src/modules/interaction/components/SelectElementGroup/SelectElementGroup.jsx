import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import reduce from 'lodash/reduce';
import { useParams } from 'react-router-dom';
import { useQuery, useReactiveVar } from '@apollo/client';

import { Icon, ErrorMessage } from 'components';
import { SelectInput } from 'components/PropertyEditor';
import { getAddInteraction } from '@/graphql/LocalState/addInteraction';
import { GET_ELEMENT_GROUPS } from '@/graphql/ElementGroup/queries';

export const SelectElementGroup = ({ value, onChange }) => {
	const { nodeId } = useParams();
	const { showSelectElementGroupModal } = useReactiveVar(getAddInteraction);
	const { data, loading, error, refetch } = useQuery(GET_ELEMENT_GROUPS, {
		variables: {
			nodeId: parseInt(nodeId),
		},
	});

	useEffect(() => {
		if (showSelectElementGroupModal) {
			(async function () {
				await refetch();
			})();
		}
	}, [showSelectElementGroupModal]);

	if (loading) return <Icon loading />;

	if (error) return <ErrorMessage error={error} />;

	const elementGroups = data.result;

	const options = reduce(
		elementGroups,
		function (result, value, key) {
			result.push({ label: value.name, value: value.id });
			return result;
		},
		[]
	);

	return (
		<SelectInput
			onChange={onChange}
			value={value}
			options={[{ label: 'No Group', value: '' }, ...options]}
		/>
	);
};

SelectElementGroup.propTypes = {
	value: PropTypes.object.isRequired,
	onChange: PropTypes.func.isRequired,
};
