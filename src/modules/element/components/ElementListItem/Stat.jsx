import React from 'react';
import PropTypes from 'prop-types';

import { Icon } from 'components';

/**
 * Handle the loading, error  status of the analytics stat
 * @param loading
 * @param error
 * @param stat
 * @returns {*}
 * @constructor
 */
export const Stat = ({ loading, error, stat }) => {
	if (error) return <span>-</span>;

	if (loading) return <Icon loading />;

	if (stat === null) return 0;

	return stat;
};

Stat.propTypes = {
	loading: PropTypes.bool.isRequired,
	error: PropTypes.string.isRequired,
	stat: PropTypes.string,
};
