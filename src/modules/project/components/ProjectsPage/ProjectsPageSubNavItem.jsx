import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { useNavigate } from 'react-router-dom';

import styles from './ProjectsPageSubNav.module.scss';

export const ProjectsPageSubNavItem = ({
	item,
	whitelabel,
	verticalFoldersScroll,
	action,
}) => {
	const navigate = useNavigate();

	const wrapperClasses = cx(styles.item, {
		sn_whitelabel: whitelabel && whitelabel.primary_color,
		[styles.noWrap]: verticalFoldersScroll,
	});

	const handleClick = ({ item, action, history }) => {
		// First try and fire a global click action passed in
		if (action) {
			action();
			return;
		}

		// Next check the array item for a local click action
		if (item.action) {
			item.action();
			return;
		}

		// If no click action try to do page nav
		if (item.route) {
			navigate(item.route);
			return;
		}
	};

	return (
		<li
			className={wrapperClasses}
			key={Math.ceil(Math.random() * 10000)}
			onClick={() => handleClick({ item, action, history })}
		>
			<div
				className={cx(styles.text, {
					[styles.active]: item.active > 0,
					sn_active: !!item.active,
				})}
			>
				<p>{item.text}</p>
			</div>
		</li>
	);
};

ProjectsPageSubNavItem.propTypes = {
	item: PropTypes.object.isRequired,
	whitelabel: PropTypes.bool.isRequired,
	verticalFoldersScroll: PropTypes.bool,
	action: PropTypes.func.isRequired,
};
