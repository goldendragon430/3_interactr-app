import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useQuery } from '@apollo/client';
import reduce from 'lodash/reduce';
import { useParams } from 'react-router-dom';

import { Button } from 'components/Buttons';
import { SelectInput } from 'components/PropertyEditor';
import Emitter, { TOGGLE_ELEMENT_GROUP_MODAL } from 'utils/EventEmitter';
import { useElementGroupRoute } from '../routeHooks';
import { GET_ELEMENT_GROUPS } from '@/graphql/ElementGroup/queries';

/**
 *
 * @param props
 * @returns {null|*}
 * @constructor
 */
export const SelectElementGroup = ({ value, ...props }) => {
	const { nodeId } = useParams();

	const { data, loading, error, refetch } = useQuery(GET_ELEMENT_GROUPS, {
		fetchPolicy: 'cache-only',
		variables: { nodeId: Number(nodeId) },
	});

	const [, setElementGroup] = useElementGroupRoute();

	useEffect(() => {
		(async function () {
			await refetch();
		})();
	}, [refetch]);

	if (loading || error) return null;

	const elementGroups = data.result;

	const options = reduce(
		elementGroups,
		function (result, value) {
			result[value.id] = value.name;
			return result;
		},
		{}
	);

	return (
		<>
			<SelectInput
				value={value}
				{...props}
				options={{ '': 'No Group', ...options }}
			/>
			<Button
				secondary
				onClick={() => Emitter.emit(TOGGLE_ELEMENT_GROUP_MODAL)}
				icon='plus'
				small
				style={{ marginTop: '10px' }}
			>
				Create New
			</Button>
			{!!value && (
				<Button
					onClick={() => setElementGroup(value)}
					secondary
					icon='edit'
					small
					style={{ marginTop: '10px', marginLeft: '10px' }}
				>
					Edit Element Group
				</Button>
			)}
		</>
	);
};

SelectElementGroup.propTypes = {
	value: PropTypes.string,
};
