import React from 'react';
import gql from 'graphql-tag';
import math from 'math.js';
import { useQuery } from '@apollo/client';
import { useReactiveVar } from '@apollo/client';
import { useParams } from 'react-router-dom';
import { errorAlert } from '../../../utils/alert';
import { useElementRoute } from '../../element/routeHooks';
import {
	ADD_INTERACTION_VAR_INITIAL_DATA,
	getAddInteraction,
	setAddInteraction,
} from '../../../graphql/LocalState/addInteraction';
import AddImageFromComputerModal from './AddImageFromComputerModal';
import SelectImageElementTypeModal from './SelectImageElementTypeModal';
import { SelectElementGroupModal } from './SelectElementGroup/SelectElementGroupModal';
import AddFromImageLibraryModal from './AddFromImageLibraryModal';
import AddHtmlElementModal from './AddHtmlElementModal';
import { useInteractionCommands } from '../../../graphql/Interaction/hooks';
import { useCreateElement } from '../../../graphql/Element/hooks';

const PLAYER_QUERY = gql`
	query player {
		player @client {
			duration
			playedSeconds
		}
	}
`;

const SelectInteractionModal = () => {
	const { newElement } = useReactiveVar(getAddInteraction);
	const [createElement, { loading: creating }] = useCreateElement(
		newElement.type
	);
	const { nodeId } = useParams();
	const { data, loading, error } = useQuery(PLAYER_QUERY);
	const { createInteraction } = useInteractionCommands();
	const [_, setElementId] = useElementRoute();

	if (loading || error) return null;

	const onClose = () => {
		setAddInteraction({
			...ADD_INTERACTION_VAR_INITIAL_DATA,
			showSelectElementGroupModal: false,
			showSelectImageElementTypeModal: false,
			showAddFromImageLibraryModal: false,
			showAddImageFromComputerModal: false,
			showAddHtmlElementModal: false,
			showAddElementModal: false,
		});
	};

	const handleInteractionCreate = async (element, type, element_group_id) => {
		try {
			const { duration, playedSeconds } = data.player;

			const request = await createInteraction({
				variables: {
					input: {
						element_type: type,
						element_id: parseInt(element.id),
						timeIn: playedSeconds - (playedSeconds ? 0.01 : 0), // This ensures the element shows on the video straight away
						// If the media has no duration we default this to 1 so should the user change
						// the media to one that does have a duration the timeline bar doesn't mess up
						timeOut: duration ? duration : 1,
						node_id: parseInt(nodeId),
						// IF we pass 0 back it fails on insert in MYSQL as there's a foreign key
						// between element groups and interactions so we need to change to null
						element_group_id:
							element_group_id === 0 ? null : parseInt(element_group_id),
					},
				},
			});			
			setElementId(request.data.result.id);
		} catch (err) {
			console.error(err);
			errorAlert({
				title: 'Error creating element',
				text: 'We was unable to create the new element, please try again. If the problem persits please contact support',
			});
		}
	};

	const handleCreate = async () => {
		// First we create an element, this is because modal elements and interaction
		// elements are the same as this level. Once the element is created we pass that
		// to the onSelect function that with either create a interaction or modal element
		// parent as needed
		const { type, src, html, posObject, name, element_group_id } = newElement;

		if (type === 'App\\ImageElement' && !src) {
			return errorAlert({
				title: 'Error creating image element',
				text: 'Please select an image you want to upload. If the problem persits please contact support',
			});
		}

		try {
			const element = {
				name,
				posX: math.round(posObject.x, 4),
				posY: math.round(posObject.y, 4),
			};

			if (src) element.src = src;

			if (html) element.html = html;
			
			const request = await createElement(element);

			let result = request.data.result;
			result.id = Number(result.id);

			onClose();
			await handleInteractionCreate(result, type, element_group_id);
		} catch (e) {
			console.log(e);
			errorAlert({
				title: 'Error creating element',
				text: 'We were unable to create the new element, please try again. If the problem persits please contact support',
			});
		}
	};

	return (
		<>
			<SelectElementGroupModal
				close={onClose}
				handleCreate={handleCreate}
				loading={creating}
			/>

			<SelectImageElementTypeModal close={onClose} />

			<AddFromImageLibraryModal close={onClose} handleCreate={handleCreate} />

			<AddImageFromComputerModal
				close={onClose}
				handleCreate={handleCreate}
				loading={creating}
			/>

			<AddHtmlElementModal
				close={onClose}
				handleCreate={handleCreate}
				loading={creating}
			/>
		</>
	);
};

export default SelectInteractionModal;
