import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import cx from 'classnames';
import ReactTooltip from 'react-tooltip';
import { Draggable } from 'react-beautiful-dnd';

import { Icon } from 'components';
import { CopyElementIcon } from './CopyElementIcon';
import { DeleteElementIcon } from './DeleteElementIcon';
import { StatsSection } from './StatsSection';
import { getTypename } from '../../utils';
import styles from '../ElementList/ElementList.module.scss';

/**
 * Element list item used by both interaction elements and modal
 * elements so it's important to ensure this has no links to "interaction"
 * @param element
 * @param onSelect
 * @param onDelete
 * @returns {JSX.Element}
 * @constructor
 */
export const ElementListItem = ({
	element,
	onSelect,
	onDelete,
	onCopy,
	index,
	active,
}) => {
	const { name } = element;

	const getItemStyle = (isDragging, draggableStyle) => ({
		// styles we need to apply on draggables
		...draggableStyle,
	});

	return (
		<Draggable key={element.id} draggableId={element.id} index={index}>
			{(provided, snapshot) => (
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
							[styles.elementListItemActive]: active,
						})}
						style={{paddingLeft: '30px'}}
					>
						<ReactTooltip className='tooltip' />
						<div className={styles.dragHandle} {...provided.dragHandleProps} style={{marginLeft: '30px'}}>
							<Icon name={'arrows-alt'} />
						</div>
						<div className='col6' style={{ paddingLeft: '30px' }}>
							<h3 className={cx(styles.heading, 'ellipsis')} onClick={onSelect}>
								{name}
							</h3>
							<small className={styles.subHead}>
								{getTypename(element.__typename)} / Created{' '}
								{moment.utc(element.created_at).fromNow()}
							</small>
						</div>
						<StatsSection element={element} />
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
			)}
		</Draggable>
	);
};

ElementListItem.propTypes = {
	element: PropTypes.object.isRequired,
	onSelect: PropTypes.func.isRequired,
	onDelete: PropTypes.func.isRequired,
	onCopy: PropTypes.func.isRequired,
	index: PropTypes.number.isRequired,
	active: PropTypes.bool,
};
