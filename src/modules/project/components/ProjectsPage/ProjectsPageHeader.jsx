import React from 'react';
import PropTypes from 'prop-types';
import { useReactiveVar } from '@apollo/client';
import cx from 'classnames';

import { Breadcrumb } from 'components';
import { getWhitelabel } from '@/graphql/LocalState/whitelabel';

import styles from './ProjectsPageHeader.module.scss';

const _propTypes = {
	/** Heading specific to the route we're on */
	heading: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
	/** meta element that shows up under the breadcrumb directly  */
	meta: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
	/** right side of the header row, an element */
	right: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
	/** custom styles that will be applied to the header wrapper */
	headerStyles: PropTypes.object,
};

export const ProjectsPageHeader = ({
	heading,
	right,
	meta,
	headerStyles,
	className,
}) => {
	const whitelabel = useReactiveVar(getWhitelabel);

	let customHeaderStyles = {};

	if (headerStyles) {
		customHeaderStyles = {
			...headerStyles,
		};
	}

	if (whitelabel) {
		customHeaderStyles.background = whitelabel.background_colour;
	}

	return (
		<div className={cx(styles.header, className)} style={customHeaderStyles}>
			<div className={styles.container}>
				<div className={cx('flex-3', styles.left)}>
					<Breadcrumb />
					<br />
					<div className={cx(styles.meta, 'clearfix')}>{meta}</div>
					<div>{heading}</div>
				</div>
				<div className={cx('flex-5', styles.right)}>{right}</div>
			</div>
		</div>
	);
};

ProjectsPageHeader.propTypes = _propTypes;
