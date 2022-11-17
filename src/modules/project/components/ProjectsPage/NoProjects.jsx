import React from 'react';

import { Icon } from 'components';
import { LinkButton } from 'components/Buttons';
import styles from '../ProjectsPage.module.scss';
import { addProjectPath } from '../../routes';

/**
 * Show No Projects message if user does not have any yet
 * @returns {*}
 * @constructor
 */
export const NoProjects = () => {
	return (
		<div className={styles.noProjectWrapperSearch}>
			<h1 style={{ marginBottom: 0 }}>
				<Icon name='exclamation-triangle' size={'lg'} />
			</h1>
			<h2>No Projects Here...</h2>
			{/* <LinkButton to={addProjectPath()} primary large>
				<Icon name={'plus'} /> Create A New Project
			</LinkButton> */}
		</div>
	);
};
