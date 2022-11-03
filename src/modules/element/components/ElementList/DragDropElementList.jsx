import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import _reduce from 'lodash/reduce';
import _map from 'lodash/map';
import _size from 'lodash/size';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';

import {
	buildNodeElementsDefaultTree,
	getFreshDragDropSortedData,
	reorderGroupItems,
} from '../../utils';
import { SAVE_NODE_PAGE } from 'utils/EventEmitter';

/**
 * The parent drag&drop component to handle element groups and elements reordering
 * @param children
 * @param node
 * @returns {*}
 * @constructor
 */
export const DragDropElementList = ({ children, node }) => {
	const [dragging, setDragging] = useState(false);
	const [groups, setGroups] = useState([]);

	// ONLY update the data from props if the list is not dragging, otherwise the drag&drop is breaking
	useEffect(() => {
		if (node) {
			setGroups(buildNodeElementsDefaultTree(node));
		}
		if (node && !dragging) {
			setGroups(buildNodeElementsDefaultTree(node));
		}
	}, [node]);

	useEffect(() => {
		let updatedData = getFreshDragDropSortedData(groups);

		// save accumulated data
		if (node && _size(updatedData)) {
			const customEvent = new CustomEvent(SAVE_NODE_PAGE, {
				detail: updatedData,
			});

			window.dispatchEvent(customEvent);
		}
	}, []);

	const ignoreOrdering = (result) => {
		const { destination, type } = result;

		// if one group dropped to replace No Group item, stop/ignore dragEnd logic
		const groupReplacedByNoGroup =
			destination.droppableId === 'noGroup' && type === 'droppableGroupItem';

		// if dropped item pushed back to previous place, stop/ignore dragEnd logic
		return !destination || groupReplacedByNoGroup;
	};

	const handleDragEnd = (result) => {
		if (ignoreOrdering(result)) return;

		const sourceIndex = result.source.index;
		const destIndex = result.destination.index;
		let newGroups = [];

		/**
		 * In this case the element groups are reOrdered
		 */
		if (result.type === 'droppableGroupItem') {
			if (groups && groups[destIndex] && groups[destIndex].id === 'noGroup') {
				return;
			}
			newGroups = reorderGroupItems(groups, sourceIndex, destIndex);
		}

		/**
		 * In this case the elements are reordered
		 */
		if (result.type === 'droppableElementItem') {
			const itemSubItemMap = _reduce(
				groups,
				(acc, group) => {
					acc[group.id] = group.interactions;
					return acc;
				},
				{}
			);

			const { source, destination } = result;

			const sourceParentId = source.droppableId;
			const destParentId = destination.droppableId;

			const sourceSubItems = itemSubItemMap[sourceParentId];
			const destSubItems = itemSubItemMap[destParentId];

			newGroups = [...groups];

			/** In this case elements are reOrdered inside same group  */
			if (sourceParentId === destParentId) {
				const reorderedInteractions = reorderGroupItems(
					sourceSubItems,
					sourceIndex,
					destIndex
				);

				newGroups = _map(newGroups, (group) => {
					if (group.id === sourceParentId) {
						group.interactions = reorderedInteractions;
					}
					return group;
				});
			}

			/** In this case elements are reordered from one group into another */
			if (sourceParentId !== destParentId) {
				let newSourceSubItems = [...sourceSubItems];
				const [draggedItem] = newSourceSubItems.splice(sourceIndex, 1);
				let newDestSubItems = [...destSubItems];
				newDestSubItems.splice(destIndex, 0, draggedItem);

				newGroups = _map(newGroups, (group) => {
					if (group.id === sourceParentId) {
						group.interactions = newSourceSubItems;
					} else if (group.id === destParentId) {
						group.interactions = newDestSubItems;
					}
					return group;
				});
			}
		}

		// set reordered elements state
		setGroups(newGroups);

		// get collection is going to be saved next
		let updatedData = getFreshDragDropSortedData(newGroups);
		
		// save accumulated data
		if (node) {
			if (_size(updatedData)) {
				const customEvent = new CustomEvent(SAVE_NODE_PAGE, {
					detail: updatedData,
				});

				window.dispatchEvent(customEvent);
			}
		}

		// Add little delay to for updating 'node' prop smoothly without breaking drag&drop list
		// setTimeout(() => {
		//     setDragging(false);
		// }, 2000);
	};

	const getListStyle = (isDraggingOver) => ({
		background: '#fff',
	});

	return (
		<DragDropContext
			onDragEnd={handleDragEnd}
			onDragStart={() => setDragging(true)}
		>
			<Droppable droppableId='droppable' type='droppableGroupItem'>
				{(provided, snapshot) => (
					<div
						ref={provided.innerRef}
						// style={getListStyle(snapshot.isDraggingOver)}
						{...provided.droppableProps}
					>
						{node ? children({ groups }) : children}
						{provided.placeholder}
					</div>
				)}
			</Droppable>
		</DragDropContext>
	);
};

DragDropElementList.propTypes = {
	node: PropTypes.object,
};
