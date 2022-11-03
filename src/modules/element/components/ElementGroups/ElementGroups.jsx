import React from 'react';
import _map from 'lodash/map';
import gql from 'graphql-tag';
import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';

import { INTERACTION_FRAGMENT } from '@/graphql/Interaction';
import { ErrorMessage, Icon } from 'components';
import { DragDropElementList } from '../ElementList/DragDropElementList';
import { ElementGroup } from './ElementGroup';

const NODE_QUERY = gql`
	query node($nodeId: ID!) {
		node(id: $nodeId) {
			id
			enable_interaction_layer
			interaction_layer_id
			interactions {
				...InteractionFragment
			}
			element_groups {
				id
				name
				zIndex
			}
		}
	}
	${INTERACTION_FRAGMENT}
`;

/**
 * Render the elements grouped by element
 * group
 * @param interactions
 * @param nodeId
 * @returns {Array|*}
 * @constructor
 */
export const ElementGroups = () => {
	const { nodeId } = useParams();
	const { data, loading, error } = useQuery(NODE_QUERY, {
		variables: { nodeId },
		fetchPolicy: 'cache-only',
	});

	if (loading) return <Icon loading />;
	if (error) return <ErrorMessage error={error} />;

	const { node } = data;

	return (
		<DragDropElementList node={node}>
			{({ groups }) =>
				_map(groups, (group, index) => (
					<ElementGroup
						key={'element_group_' + group.id}
						group={group}
						index={index}
					/>
				))
			}
		</DragDropElementList>
	);
};
