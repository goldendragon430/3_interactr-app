import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import first from 'lodash/first';
import { useReactiveVar } from '@apollo/client';

import { Icon } from 'components';
import { injectStyles } from 'utils';
import { getWhitelabel } from '@/graphql/LocalState/whitelabel';
import { ProjectsPageSubNavItem } from './ProjectsPageSubNavItem';

import styles from './ProjectsPageSubNav.module.scss';

export const ProjectsPageSubNav = ({
	items,
	verticalFoldersScroll,
	action,
	loading,
}) => {
	const whitelabel = useReactiveVar(getWhitelabel);
	const wrapperClasses = cx(styles.wrapper, {
		[styles.verticalFoldersScroll]: verticalFoldersScroll,
	});

	return (
		<ul className={wrapperClasses}>
			{whitelabel ? setWhiteLabelCss(whitelabel) : null}
			<ProjectsPageSubNavItem
				key={`sub_nav_item_${first(items).id || Math.random()}`}
				item={first(items)}
				// isWhitelabel={isWhitelabel}
				whitelabel={whitelabel}
				verticalFoldersScroll={verticalFoldersScroll}
				action={action}
			/>
			{loading ? (
				<div
					style={{
						height: 50,
						display: 'flex',
						alignItems: 'center',
						marginLeft: 20,
					}}
				>
					<Icon loading />
				</div>
			) : (
				items.slice(1).map((item) => (
					<ProjectsPageSubNavItem
						key={`sub_nav_item_${item.id || Math.random()}`}
						item={item}
						// isWhitelabel={isWhitelabel}
						whitelabel={whitelabel}
						verticalFoldersScroll={verticalFoldersScroll}
						action={action}
					/>
				))
			)}
		</ul>
	);
};

const setWhiteLabelCss = ({ whitelabel }) => {
	if (!whitelabel) return null;

	const _css = `
    .sn_whitelabel.sn_active button {
        color: ${whitelabel.primary_color};
    }
    .sn_whitelabel button:hover  {
        color: ${whitelabel.primary_color};
        // filter : brightness(.9);
        opacity: 0.9;
    }
    
`;

	injectStyles('whitelabel_sn', _css);
};

ProjectsPageSubNav.propTypes = {
	items: PropTypes.array.isRequired,
	verticalFoldersScroll: PropTypes.bool,
	action: PropTypes.func.isRequired,
	loading: PropTypes.bool.isRequired,
};
