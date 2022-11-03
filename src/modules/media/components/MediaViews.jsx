import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import { Icon } from 'components';
import { useAnalytics } from 'utils/hooks';

export const MediaViews = ({ id }) => {
	const ANALYTICS_QUERY = [
		{
			name: 'media_views',
			collection: 'MediaView',
			api: 'Interactr',
			filters: {
				media_id: id,
			},
			start_date: moment().subtract(1, 'year'),
			end_date: moment(),
		},
	];

	const [data, { loading, error }] = useAnalytics(ANALYTICS_QUERY);

	const stat = data?.media_views;

	if (error) return <span>-</span>;

	if (loading) return <Icon loading />;

	if (stat === null) return 0;

	return stat;
};

MediaViews.propTypes = {
	id: PropTypes.string.isRequired,
};
