import React, { useState, useEffect } from 'react';

import moment from 'moment';
import _reduce from 'lodash/reduce';
import _map from 'lodash/map';
import _size from 'lodash/size';
import cx from 'classnames';

import ReactTooltip from 'react-tooltip';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { Icon } from 'components';
import { StatsSection } from '../ElementListItem/StatsSection';
import { CopyElementIcon } from '../ElementListItem/CopyElementIcon';
import { DeleteElementIcon } from '../ElementListItem/DeleteElementIcon';
import { getTypename } from '../../utils';
import { useModalElementRoute } from 'modules/modal/routeHooks';
import { useModalElementCommands } from '@/graphql/Modal/hooks';
import { ModalElement } from 'modules/modal/components/ModalEditor/ModalElements/ModalElement';
import { motion } from 'framer-motion';
import { cache } from "@/graphql/client";

import modaltabStyles from 'modules/modal/components/ModalEditor/ModalTabs/ModalTabs.module.scss';
import styles from './ElementList.module.scss';
/**
 * The parent drag&drop component to handle element groups and elements reordering
 * @param children
 * @param node
 * @returns {*}
 * @constructor
 */

const getRenderItem = (elements) => (provided, snapshot, rubric) => {

	const getItemStyle = (isDragging, draggableStyle) => ({
		// styles we need to apply on draggables
		...draggableStyle,
	});
	const [, setModalElementId] = useModalElementRoute();
	const { deleteModalElement, copyModalElement } = useModalElementCommands();
	const onSelect = () => setModalElementId(elements[rubric.source.index].element.id)
	const onDelete = () =>
		deleteModalElement({
			variables: {
				id: elements[rubric.source.index].element.id,
			},
		});

	const onCopy = () =>
		copyModalElement({
			variables: {
				input: {
					id: elements[rubric.source.index].element.id,
				},
			},
		});
	
    return (
        <div
			ref={provided.innerRef}
			{...provided.draggableProps}
			style={getItemStyle(
				snapshot.isDragging,
				provided.draggableProps.style
			)}
		>
			<div
				className={cx({
					[styles.elementListItem]: true,
					grid: true,
					[styles.elementListItemActive]: false,
				})}
				style={{paddingLeft: '30px'}}
			>
				<ReactTooltip className='tooltip' />
				<div className={styles.dragHandle} {...provided.dragHandleProps} style={{marginLeft: '30px'}}>
					<Icon name={'arrows-alt'} />
				</div>
				<div className='col6' style={{ paddingLeft: '30px' }}>
					<h3 className={cx(styles.heading, 'ellipsis')} onClick={onSelect}>
						{elements[rubric.source.index].element.name}
					</h3>
					<small className={styles.subHead}>
						{getTypename(elements[rubric.source.index].element.__typename)} / Created{' '}
						{moment.utc(elements[rubric.source.index].element.created_at).fromNow()}
					</small>
				</div>
				<StatsSection element={elements[rubric.source.index].element} />
				<div className={cx('col3', styles.iconCol)}>
					<span
						className={styles.icon}
						data-tip={'Edit'}
						onClick={onSelect}
					>
						<Icon icon={'edit'} />
					</span>
					<CopyElementIcon onCopy={onCopy} />
					<DeleteElementIcon onDelete={onDelete} />
				</div>
			</div>
			{provided.placeholder}
		</div>
    )
};

export const DragDropModalElementList = ({ tabAnimation, elements }) => {
	const [modalElements, setModalElements] = useState([]);		
	
	useEffect(() => {
		if(elements) {
			const temp = [];
			elements.forEach((item) => {
				temp.push(item);
			});
			temp.sort((a, b) => (a.element.zIndex < b.element.zIndex) ? 1 : -1)
			setModalElements(temp);			
		}
	}, [elements]);
	
	const handleDragEnd = (result) => {
		if (!result.destination || result.destination.index === result.source.index) {
            return;
        }  

		const startIndex = result.source.index,
		endIndex = result.destination.index;
		const [removed] = modalElements.splice(startIndex, 1);
		modalElements.splice(endIndex, 0, removed);
		
		modalElements.forEach((modalElement, index) => {
			const elementKey = cache.identify({
				id: modalElement.element.id,
				__typename: modalElement.element.__typename
			});
		
			cache.modify({
				id: elementKey,
				fields: {
					zIndex(currentIndex){
						return modalElements.length - index;
					}
				}
			});
		})
	};

	const renderItem = getRenderItem(modalElements);
	
	return (
		<DragDropContext
			onDragEnd={handleDragEnd}
		>
			<Droppable 
				droppableId='droppable'
				type='droppableGroupItem'
				// renderClone={renderItem} // commented out by MagicPalm
			>
				{(provided, snapshot) => (
					<div
						ref={provided.innerRef}
						{...provided.droppableProps}
					>
						<motion.div {...tabAnimation} className={modaltabStyles.tabBody}>
							{_map(modalElements, (modalElement, index) => (
								<ModalElement
									index={index}
									key={modalElement.id}
									modalElement={modalElement}
								/>
							))}
							{!modalElements.length && (
								<div>
									<p style={{ padding: '5px 30px' }}>
										No Elements Created Yet. Click New Element Above To Add An Element
										To This Popup
									</p>
								</div>
							)}
						</motion.div>
						{provided.placeholder}
					</div>
				)}
			</Droppable>
		</DragDropContext>
	);
};

DragDropModalElementList.propTypes = {
	
};
