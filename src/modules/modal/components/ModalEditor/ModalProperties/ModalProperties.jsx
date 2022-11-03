import React, { useState } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { motion } from 'framer-motion';

import { Icon } from 'components';
import { ModalPropertiesTabs } from './ModalPropertiesTabs';

import styles from './ModalProperties.module.scss';

/**
 * Handle the modal properties section
 * @returns {null|*}
 * @constructor
 */
export const ModalProperties = ({ tabAnimation }) => {
	const [tab, setTab] = useState('properties');

	return (
		<motion.div {...tabAnimation} className={styles.tabBody}>
			<ul className={styles.tabHeaderWrapper}>
				<li
					onClick={() => setTab('properties')}
					className={cx(styles.tabHeader, {
						[styles.active]: tab === 'properties',
					})}
				>
					<Icon name='sliders-v' /> Properties
				</li>
				<li
					onClick={() => setTab('animation')}
					className={cx(styles.tabHeader, {
						[styles.active]: tab === 'animation',
					})}
				>
					<Icon name='camera-movie' /> Background Animation
				</li>
				<li
					onClick={() => setTab('timer')}
					className={cx(styles.tabHeader, { [styles.active]: tab === 'timer' })}
				>
					<Icon name='clock' /> Timer
				</li>
				<li
					onClick={() => setTab('close-icon')}
					className={cx(styles.tabHeader, {
						[styles.active]: tab === 'close-icon',
					})}
				>
					<Icon name='times' /> Close Icon
				</li>
			</ul>
			<div className={styles.tabBody}>
				<ModalPropertiesTabs activeTab={tab} />
			</div>
		</motion.div>
	);
};

ModalProperties.propTypes = {
	tabAnimation: PropTypes.object.isRequired,
};
