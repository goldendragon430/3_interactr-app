import React from 'react';
import PropTypes from 'prop-types';

import { useElementGroupRoute } from 'modules/element/routeHooks';
import { Icon } from 'components';
import { DeleteElementGroupIcon } from './DeleteElementGroupIcon';

import styles from '../ElementList/ElementList.module.scss';

/**
 * Render the element group name heading
 * @param id
 * @param elementGroups
 * @returns {*}
 * @constructor
 */
export const ElementGroupHeader = ({ name, id, dragHandler }) => {
	const [, setElementGroupId] = useElementGroupRoute();

	if (id === 'noGroup') {
		// No Group
		return <h3 className={styles.elementList}>{name}</h3>;
	}

	return (
		<>
			<h3 className={styles.elementList}>
				<small style={{ paddingRight: '15px' }} {...dragHandler}>
					<Icon name={'arrows-alt'} />
				</small>
				<span
					onClick={() => setElementGroupId(id)}
					style={{ cursor: 'pointer' }}
				>
					{name}
				</span>
				<small
					onClick={() => setElementGroupId(id)}
					style={{ paddingLeft: '20px', paddingRight: '15px' }}
					className='clickable'
				>
					<Icon name={'edit'} />
				</small>
				<DeleteElementGroupIcon id={id} />
			</h3>
		</>
	);
};

ElementGroupHeader.propTypes = {
	name: PropTypes.string.isRequired,
	id: PropTypes.string.isRequired,
	dragHandler: PropTypes.object,
};
