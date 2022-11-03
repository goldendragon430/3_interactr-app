import React from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';

import { useElementRoute } from 'modules/element/routeHooks';
import { useInteractionCommands } from '@/graphql/Interaction';
import { ElementListItem } from '../ElementListItem';

/**
 * Render the single element from the
 * list of elements
 * @param interaction
 * @returns {*}
 * @constructor
 */
export const Element = ({ interaction, index }) => {
	const { nodeId, interactionId } = useParams();

	const [, setElement] = useElementRoute();

	const { deleteInteraction, copyInteraction } = useInteractionCommands();

	const onDelete = () =>
		deleteInteraction({
			variables: {
				id: interaction.id,
			},
		});

	const onCopy = () =>
		copyInteraction({
			variables: {
				input: {
					id: interaction.id,
					node_id: parseInt(nodeId),
				},
			},
		});

	return (
		<ElementListItem
			element={interaction.element}
			onDelete={onDelete}
			onSelect={() => setElement(interaction.id)}
			onCopy={onCopy}
			index={index}
			active={interactionId === interaction.id}
		/>
	);
};

Element.propTypes = {
	interaction: PropTypes.object.isRequired,
	index: PropTypes.number.isRequired,
};
