import React, { useContext, useEffect } from 'react';
import _forEach from 'lodash/forEach';
// import { MenuContext } from 'react-flexible-sliding-menu';

import {
	useElementGroupRoute,
	useElementRoute,
} from 'modules/element/routeHooks';
import { ElementGroups } from '../ElementGroups';

/**
 * Render a selectable list of elements
 * @returns {null|*}
 * @constructor
 */
export const ElementsList = () => {
	//const { openMenu, closeMenu } = useContext(MenuContext); // TODO
	const [elementId] = useElementRoute();
	const [elementGroupId] = useElementGroupRoute();

	// If the URL contains an element id open
	// the element editor menu if it doesn't
	// close it because we may be coming back
	// from an element page
	useEffect(() => {
		if (Number.isInteger(elementId) || Number.isInteger(elementGroupId)) {
			// openMenu();
		} else {
			// closeMenu(); 
		}
	}, [elementId, elementGroupId]);

	return <ElementGroups />;
};

/**
 * Group all of the interactions by the element group id
 * so we display all elements under the appropriate
 * group heading in the UI
 * @param interactions
 * @returns {{"0": []}}
 */
const groupByElementGroup = (interactions) => {
	let interactionsByElementGroup = {
		0: [],
	};

	_forEach(interactions, (interaction) => {
		if (interaction.element_group_id) {
			// We need to check if the key already exists in the object, if if
			// does we need to push to the array of interactions if it doesn't
			// we need to create a new array on the key of the element group
			if (interactionsByElementGroup[interaction.element_group_id]) {
				interactionsByElementGroup[interaction.element_group_id].push(
					interaction
				);
			} else {
				interactionsByElementGroup[interaction.element_group_id] = [
					interaction,
				];
			}
		} else {
			// All interactions with no group get pushed to the key 0
			interactionsByElementGroup[0].push(interaction);
		}
	});

	return interactionsByElementGroup;
};
