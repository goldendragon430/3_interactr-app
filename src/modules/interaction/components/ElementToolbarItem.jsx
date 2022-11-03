import React from 'react';
import PropTypes from 'prop-types';

import {
	ADD_INTERACTION_VAR_INITIAL_DATA,
	setAddInteraction,
} from '@/graphql/LocalState/addInteraction';

import {
	ADD_MODAL_ELEMENT_VAR_INITIAL_DATA,
	setAddModalElement,
} from '@/graphql/LocalState/addModalElement';

import { getRelativeDrop } from 'modules/composer/dragging';
import { ElementItem } from 'modules/node/components/ElementItem';
import { MODAL_EDITOR_DOM_ID } from 'modules/modal/utils';
import { ELEMENT_EDITOR_DOM_ID } from '../utils.js';

import styles from './ElementToolbar.module.scss';

export const ElementToolbarItem = ({ element }) => {
	const handleDragStop = (e) => {
		const acceptedDropNode = getRelativeDrop(ELEMENT_EDITOR_DOM_ID, e);
		const acceptedDropModal = getRelativeDrop(MODAL_EDITOR_DOM_ID, e);

		if (!acceptedDropModal && !acceptedDropNode) return;

		if(acceptedDropNode) {
			setAddInteraction({
				...ADD_INTERACTION_VAR_INITIAL_DATA,
				showSelectElementGroupModal: true,
				newElement: {
					type: element.type,
					posObject: acceptedDropNode,
				},
			});
		}

		if(acceptedDropModal) {
			setAddModalElement({
				...ADD_MODAL_ELEMENT_VAR_INITIAL_DATA,
				showAddElementModal: true,
				newElement: {
					type: element.type,
					posObject: acceptedDropModal,
				},
			});
		}
	};

	return (
		<div className={styles.ElementToolbarItem}>
			<ElementItem
				element={element}
				// onSelectElement={() => handleSelectElement({ x: 50, y: 50 })}
				onDragged={handleDragStop}
			/>
		</div>
	);
};

ElementToolbarItem.propTypes = {
	element: PropTypes.object.isRequired,
};
