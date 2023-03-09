import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import ElementContainer from '../../element/components/Element/ElementContainer';
import uniqueId from 'lodash/uniqueId';
import { useQuery, useReactiveVar } from '@apollo/client';
import gql from 'graphql-tag';
import { useParams } from 'react-router-dom';
import {
	useInteraction,
	useInteractionCommands,
} from '../../../graphql/Interaction/hooks';
import find from 'lodash/find';
import { useElementRoute } from '../../element/routeHooks';
import { useInteractionRoute } from '../routeHooks';
import Swal from 'sweetalert2';
import { errorAlert } from '../../../utils/alert';
import { useNodeRoute } from '../../node/routeHooks';
import { playerVar } from '../../../graphql/LocalState/player';
import { cache } from '../../../graphql/client';
import client from '../../../graphql/client';
import { GET_ELEMENT_GROUPS } from '@/graphql/ElementGroup/queries';

/**
 * Interaction editor controls if an element should show in the video or not. If it should
 * we render the element, if not return null; This only handles interaction elements
 * not modal elements
 * @param interactionId
 * @returns {*}
 * @constructor
 */
const InteractionEditor = ({ interaction, projectFont }) => {
	const { nodeId } = useParams();
	// const { data, error, loading } = useQuery(GET_ELEMENT_GROUPS, {
	// 	variables: {
	// 		nodeId: Number(nodeId),
	// 	},
	// });
	// console.log(data);
	// Save unique key as we're rendering a list item
	const [key] = useState(uniqueId());

	// Save the element show / hide state in the local state
	const [showElement, setShowElement] = useState(true);

	// Is this element selected
	const [activeInteractionId, setActiveInteraction] = useInteractionRoute();
	const [_activeInteractionId] = useElementRoute();

	const { deleteInteraction } = useInteractionCommands(interaction.id);

	const [_, goToNodePage] = useNodeRoute();

	// Get the stuff needed from the player var
	const player = useReactiveVar(playerVar);

	const { playedSeconds, duration } = player;
	
	const {
		element,
		element_type,
		timeIn,
		timeOut,
		element_group_id,
		show_at_video_end,
	} = interaction;

	// Figure out if we need to get the time in and out values from the interaction or the element group
	const elementGroup = element_group_id
		? cache.readFragment({
				id: `ElementGroup:${element_group_id}`,
				fragment: gql`
					fragment ElementGroupFragment on ElementGroup {
						id
						name
						timeIn
						timeOut
						show_at_video_end
						zIndex
					}
				`,
		  })
		: null;

	// We save the timeIN / time Out and show at end values  from either the
	// element group OR the element depending on if the interaction has
	// a group.
	const _timeIn = elementGroup ? elementGroup.timeIn : timeIn;
	const _timeOut = elementGroup ? elementGroup.timeOut : timeOut;
	const _showOnEnd = elementGroup
		? elementGroup.show_at_video_end
		: show_at_video_end;

	// Work out if the element should be shown
	useEffect(() => {
		if (_showOnEnd) {
			if (duration !== 0 && playedSeconds >= duration) {
				setShowElement(true);
			} else {
				setShowElement(false);
			}
		} else {
			const pastElementShowTime = playedSeconds >= _timeIn;

			const pastElementHideTime = playedSeconds > _timeOut;

			setShowElement(pastElementShowTime && !pastElementHideTime);
		}
	}, [playedSeconds, _timeIn, _timeOut, _showOnEnd, element_group_id]);

	if (!showElement) return null;

	const handleDelete = () => {
		Swal.fire({
			title: 'Are you sure? ',
			text: 'Are you sure you want to delete this element',
			icon: 'warning',
			showCloseButton: true,
			showCancelButton: true,
			confirmButtonColor: '#ff6961',
			confirmButtonText: 'Delete',
		}).then(async (result) => {
			if(result.isConfirmed) {
				deleteInteraction({
					variables: {
						id: interaction.id,
					},
				});
				goToNodePage(interaction.node_id);
			}
		});
	};

	if (elementGroup?.name == 'Test02 ') {
		console.log({
			name: elementGroup?.name,
			groupIndex: elementGroup?.zIndex,
			interactionIndex: interaction.element.zIndex,
		});
	}

	// const zIndex = elementGroup
	// 	? elementGroup.zIndex + interaction.element.zIndex
	// 	: interaction.element.zIndex;

	if (elementGroup?.name == 'Test02 ') {
		console.log(elementGroup?.name, interaction.element, zIndex);
	}
	return (
		<ElementContainer
			key={key}
			element={element}
			// zIndex={zIndex}
			zIndex={element.zIndex}
			element_type={element_type}
			onSelect={() => setActiveInteraction(interaction.id)}
			selected={
				activeInteractionId === interaction.id ||
				_activeInteractionId === interaction.id
			}
			onDelete={handleDelete}
			// This is used so when we fire the global animation event the
			// right elements actually animate
			animationKey={'Node:' + interaction.node_id}
			projectFont={projectFont}
		/>
	);
};

export default InteractionEditor;
