import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import moment from 'moment';

import { useAnalytics } from 'utils/hooks';
import { Stat } from './Stat';

import styles from '../ElementList/ElementList.module.scss';

function getShouldShowClicksStat(element) {
	switch (element.__typename) {
		case 'ButtonElement':
		case 'FormElement':
		case 'ImageElement':
		case 'HotspotElement':
			return true;
		default:
			return false;
	}
}

export const StatsSection = ({ element }) => {
	const { id } = element;
	const [shouldShowClicksStat, setShouldShowClicksStat] = useState(
		getShouldShowClicksStat(element)
	);

	const query = useMemo(
		() => [
			{
				name: 'element_clicks',
				collection: 'ElementClick',
				api: 'Interactr',
				filters: {
					element_id: id,
				},
				start_date: moment().subtract(1, 'year'),
				end_date: moment(),
			},
			{
				name: 'element_impressions',
				collection: 'ElementImpression',
				api: 'Interactr',
				filters: {
					element_id: id,
				},
				start_date: moment().subtract(1, 'year'),
				end_date: moment(),
			},
		],
		[id]
	);

	const [data, { error, loading }] = useAnalytics(query);

	return (
		<div className={cx('col3', styles.statWrapper)}>
			<h5 className={cx('m-0', styles.stat)}>
				<strong>
					{' '}
					<Stat
						loading={loading}
						error={error}
						stat={data?.element_impressions}
					/>{' '}
				</strong>{' '}
				<br />
				<span className={styles.statViews}>Views</span>
			</h5>
			<h5 className={cx('m-0', styles.stat)}>
				{shouldShowClicksStat && (
					<>
						<strong>
							<Stat
								loading={loading}
								error={error}
								stat={data?.element_clicks}
							/>
						</strong>{' '}
						<br />
						<span className={styles.statViews}>Clicks</span>
					</>
				)}
			</h5>
		</div>
	);
};

StatsSection.propTypes = {
	element: PropTypes.object.isRequired,
};
