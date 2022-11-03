import React, { useState } from 'react';
import cx from 'classnames';

import { Icon } from 'components';
import { ModalTabBody } from './ModalTabBody';

import styles from './ModalTabs.module.scss';

export const ModalTabs = ({elements}) => {
	const [activeTab, setActiveTab] = useState('properties');

	return (
		<>
			<ul className={cx(styles.tabs, 'clearfix')}>
				<li
					className={cx(styles.tab, {
						[styles.active]: activeTab === 'properties',
					})}
					onClick={() => setActiveTab('properties')}
				>
					<Icon icon='cog' /> Popup Settings
				</li>
				<li
					className={cx(styles.tab, {
						[styles.active]: activeTab === 'elements',
					})}
					onClick={() => setActiveTab('elements')}
				>
					<Icon icon='list' /> Elements
				</li>
				<li
					className={cx(styles.tab, {
						[styles.active]: activeTab === 'new-element',
					})}
					onClick={() => setActiveTab('new-element')}
				>
					<Icon icon='plus' /> New Element
				</li>
			</ul>
			<ModalTabBody activeTab={activeTab} setActiveTab={setActiveTab} elements={elements} />
		</>
	);
};
