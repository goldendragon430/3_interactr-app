import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { Icon } from 'components';

export const ModalsListItemStats = ({ stats, loading, statKey }) => {
	const [stat, setStat] = useState('-');

	useEffect(() => {
		if (stats.hasOwnProperty(statKey)) {
			if (stats[statKey]) {
				setStat(stats[statKey]);
			} else {
				setStat(0);
			}
		} else {
			// Modal doesn't exist in data
			setStat('-');
		}
	}, [loading]);

	if (loading) return <Icon loading />;

	return stat;
};

ModalsListItemStats.propTypes = {
	loading: PropTypes.bool.isRequired,
	statKey: PropTypes.string.isRequired,
	stats: PropTypes.bool.isRequired,
};
