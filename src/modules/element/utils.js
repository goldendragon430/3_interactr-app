import _map from 'lodash/map';
import _filter from 'lodash/filter';
import _orderBy from 'lodash/orderBy';
import _size from 'lodash/size';
import _forEach from 'lodash/forEach';
import _find from 'lodash/find';

import {
	BUTTON_ELEMENT,
	CUSTOM_HTML_ELEMENT,
	FORM_ELEMENT,
	HOTSPOT_ELEMENT,
	IMAGE_ELEMENT,
	TEXT_ELEMENT,
	TRIGGER_ELEMENT,
} from 'modules/element/elements';

const sortOrderingToDesc = (data) => _orderBy(data, ['zIndex'], ['desc']);

// a little function to help us with reordering the result
export const reorderGroupItems = (list, startIndex, endIndex) => {
	const result = Array.from(list);
	const [removed] = result.splice(startIndex, 1);
	result.splice(endIndex, 0, removed);

	return result;
};

/**
 * used to build the initial drag/drop tree of the node elements groups with interactions
 * @param node
 * @returns {*[]}
 */
export const buildNodeElementsDefaultTree = (node) => {
	const { element_groups: groups, interactions } = node;

	const filteredElementGroups = _map(groups, (group) => {
		const groupInteractions = _filter(interactions, (interaction) => {
			return parseInt(interaction.element_group_id) === parseInt(group.id);
		});

		return {
			id: group.id,
			name: group.name,
			__typename: group.__typename,
			interactions: sortOrderingToDesc(groupInteractions),
			zIndex: group.zIndex,
		};
	});

	let noGroupInteractions = _filter(
		interactions,
		({ element_group_id: groupId }) => {
			return groupId === null || groupId === 0 || groupId === '';
		}
	);

	let sortedNoGroupInteractions = sortOrderingToDesc(noGroupInteractions);

	/**
	 * If interaction layer is enabled we add in that interactions to the start of the "no group" array so it appears
	 * at the top of the list
	 */
	if (node.enable_interaction_layer) {
		const endCardInteraction = _find(interactions, {
			id: [node.interaction_layer_id].toString(),
		});

		if (endCardInteraction) {
			sortedNoGroupInteractions.unshift(endCardInteraction);
		}
	}

	return [
		{
			id: 'noGroup',
			name: 'No Group',
			interactions: sortedNoGroupInteractions,
			zIndex: 0,
		},
		...filteredElementGroups,
	];
};

/**
 * used to restructure just rebuilt tree into graphql update data collection for saving
 *
 * @param groups
 * @returns {*[]}
 */
export const getFreshDragDropSortedData = (groups) => {
	// get all element groups length and multiply by 100
	// it's used for sorting groups by zIndex in desc order on page
	// so the groups sorting will be countered and sorted by highest zIndex values
	let groupsZindexCount = _size(groups) * 100;

	// the element_groups collection to save
	let updateGroupsData = [];
	// the elements collection to save
	let updateElementsData = [];
	// the interactions collection to save
	let updateInteractionsData = [];

	_forEach(groups, (group, index) => {
		// get all group interactions length and multiply by 10
		// each element zIndex will be set by countering the group's zIndex that element belongs to
		// it's used for sorting elements by zIndex in desc order inside group
		let elementsZindexCount = _size(group.interactions) * 10;

		_forEach(group.interactions, (interaction) => {
			const { element } = interaction;

			updateElementsData.push({
				id: element.id,
				__typename: element.__typename,
				// zIndex: elementsZindexCount + group.zIndex,
				zIndex:
					group.id !== 'noGroup'
						? elementsZindexCount + (_size(groups) - index) * 100
						: elementsZindexCount + (groupsZindexCount + 100),
			});

			updateInteractionsData.push({
				id: interaction.id,
				__typename: interaction.__typename,
				element_group_id: group.id !== 'noGroup' ? parseInt(group.id) : null,
			});

			elementsZindexCount -= 10;
		});

		// No Group item never going to reordered in UI
		if (group.id !== 'noGroup') {
			updateGroupsData.push({
				id: group.id,
				__typename: group.__typename,
				zIndex: groupsZindexCount,
			});

			groupsZindexCount -= 100;
		}
	});

	// return specific element_groups/interactions/elements collection for saving by SAVE_NODE_PAGE event
	return [
		...updateGroupsData,
		...updateInteractionsData,
		...updateElementsData,
	];
};

export const getTypename = (typename) => {
	switch (typename) {
		case 'ButtonElement':
			return 'Button';
		case 'ImageElement':
			return 'Image';
		case 'TriggerElement':
			return 'Event Action';
		case 'HotspotElement':
			return 'Hotspot';
		case 'TextElement':
			return 'Text';
		case 'FormElement':
			return 'Form';
		case 'CustomHtmlElement':
			return 'Custom Html';
	}
};

export const getQueryName = (type) => {
	switch (type) {
		case FORM_ELEMENT:
			return 'formElement';
		case BUTTON_ELEMENT:
			return 'buttonElement';
		case HOTSPOT_ELEMENT:
			return 'hotspotElement';
		case TEXT_ELEMENT:
			return 'textElement';
		case CUSTOM_HTML_ELEMENT:
			return 'customHtmlElement';
		case IMAGE_ELEMENT:
			return 'ImageElement';
		case TRIGGER_ELEMENT:
			return 'triggerElement';
	}
};
