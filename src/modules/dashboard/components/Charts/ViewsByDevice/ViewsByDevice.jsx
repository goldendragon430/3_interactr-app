import React, { useEffect } from 'react';
import ReactTooltip from 'react-tooltip';
import PropTypes from 'prop-types';

import { getAsset, isValidNumber, numberWithCommas, useSetState } from 'utils';

import styles from './ViewsByDevice.module.scss';

export const ViewsByDevice = ({ data }) => {
	const [state, setState] = useSetState({
		desktopTooltipText: null,
		mobileTooltipText: null,
		desktopPercentage: null,
		mobilePercentage: null,
	});

	useEffect(() => {
		if (data) {
			const { desktop_percentage, mobile_percentage } = data;
			setState({
				desktopTooltipText: `${
					desktop_percentage ? desktop_percentage : '0'
				}% viewed your projects on desktop`,
				mobileTooltipText: `${
					mobile_percentage ? mobile_percentage : '0'
				}% viewed your projects on mobile`,
				desktopPercentage: desktop_percentage,
				mobilePercentage: mobile_percentage,
			});
		}
	}, [data]);

	const {
		desktopTooltipText,
		mobileTooltipText,
		desktopPercentage,
		mobilePercentage,
	} = state;

	return (
		<>
			<h3>Views By Device</h3>
			<div className={styles.wrapper}>
				<div className={'grid'}>
					<ReactTooltip className='tooltip' />
					<div className={'col5'} style={{ position: 'relative' }}>
						<img src={getAsset('/img/img-desktop.png')} className={styles.icon} />
						<div className={styles.textContainer}>
							<h3>{numberWithCommas(data.desktop)}</h3>
							<p data-tip={desktopTooltipText}>{desktopPercentage}%</p>
						</div>
					</div>
					<div className={'col2'}>
						<div className={styles.divider}>&nbsp;</div>
					</div>
					<div className={'col5'} style={{ position: 'relative' }}>
						<img src={getAsset('/img/img-phone.png')} className={styles.icon} />
						<div className={styles.textContainer}>
							<h3>{numberWithCommas(data.mobile)}</h3>
							<p data-tip={mobileTooltipText}>{mobilePercentage}%</p>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

ViewsByDevice.propTypes = {
	data: PropTypes.object.isRequired,
};
