import React from 'react';
import gql from 'graphql-tag';
import { useParams } from 'react-router';
import { useReactiveVar, useQuery } from '@apollo/client';

import { Button } from 'components/Buttons';
import { NodeSettingsModal } from './NodeSettingsModal';
import { NodeSourceMediaModal } from './NodeSourceMediaModal';
import { NodeBackgroundColorModal } from './NodeBackgroundColorModal';
import {
	getNodeSettings,
	setNodeSettings,
	SHOW_NODE_SETTINGS_MODAL,
} from '@/graphql/LocalState/nodeSettings';

const QUERY = gql`
	query node($nodeId: ID!) {
		node(id: $nodeId) {
			id
			name
			media_id
			background_color
			duration
			media {
				id
				is_image
				name
				thumbnail_url
			}
		}
	}
`;

export const NodeSettings = () => {
	const { nodeId } = useParams();

	const { data, loading, error } = useQuery(QUERY, {
		variables: { nodeId },
	});

	if (loading) return null;

	if (error) {
		console.error(error);
		return null;
	}

	const { node } = data;

	return (
		<>
			<Button
				icon='sliders-v'
				text='Node Settings'
				onClick={() => {
					setNodeSettings({
						activeModal: SHOW_NODE_SETTINGS_MODAL,
					});
				}}
				style={{ marginBottom: 0, marginRight: 0 }}
			/>
			<NodeSettingsModal node={node} />
			<NodeSourceMediaModal node={node} />
			<NodeBackgroundColorModal node={node} />
		</>
	);
};
