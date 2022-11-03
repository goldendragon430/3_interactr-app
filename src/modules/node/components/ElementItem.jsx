import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import { CloneOnDrag, Icon } from 'components';

import styles from './ElementItem.module.scss';

export const ElementItem = ({ element, onDragged, locked }) => {
	const { name, description } = element;
	const classes = cx({
		[styles.elementItem]: true,
	});

	return (
		<div className={classes}>
			<CloneOnDrag
				offset={{ x: 2, y: 2 }}
				onStop={onDragged}
				dragElement={<ElementIcon />}
			>
				<div className={cx(styles.elementInfo, 'clearfix')}>
					<ElementIcon />
					<div className={styles.meta}>
						<p>
							<strong>{name}</strong>
						</p>
						<p>{description}</p>
					</div>
				</div>
			</CloneOnDrag>
			{locked ? (
				<a
					href='http://special.interactr.io/interactr-club/a.html'
					target='_blank'
					className={styles.locked}
					rel='noreferrer'
				>
					<Icon name='lock' className={styles.lockedIcon} />
					<p style={{ marginTop: 5 }}>
						<strong>Exclusive Feature</strong>
					</p>
				</a>
			) : null}
		</div>
	);
};

ElementItem.propTypes = {
	element: PropTypes.object.isRequired,
	onDragged: PropTypes.func.isRequired,
	locked: PropTypes.bool,
};

const ElementIcon = () => {
	return (
		<div className={styles.image}>
			<div style={{ background: '#ccc', width: '60px', height: '60px' }}>
				&nbsp;
			</div>
		</div>
	);
};
