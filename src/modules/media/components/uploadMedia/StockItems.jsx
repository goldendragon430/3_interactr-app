import React from 'react';
import _map from 'lodash/map';
import times from 'lodash/times';
import { AnimatePresence, motion } from 'framer-motion';
import ContentLoader from 'react-content-loader';

import StockItem from '../StockItem';
import Spinner from 'components/Spinner';

import cx from 'classnames';
import cardstyles from 'components/Card.module.scss';

import {
	animationState,
	preAnimationState,
	transition,
} from 'components/PageBody';

import styles from './StockListModalStyles.module.scss';

/**
 * Stock videos list from pixabay API
 * @param user
 * @param videos
 * @param closeModal
 * @param setFilterText
 * @returns {Array}
 * @constructor
 */
const StockItems = ({
	user,
	items,
	onSelect,
	setFilterText,
	isImages,
	loading,
}) => {
	if (loading) {
		return <ItemsLoading />;
	}

	return (
		<AnimatePresence>
			<motion.div
				exit={preAnimationState}
				initial={preAnimationState}
				animate={animationState}
				transition={transition}
				style={{ width: '100%' }}
			>
				{_map(items, (stockItem) => (
					<StockItem
						isImage={isImages}
						onSelect={onSelect}
						stockItem={stockItem}
						key={'stock_item_' + stockItem.id}
						user={user}
						setFilterText={setFilterText}
					/>
				))}
			</motion.div>
		</AnimatePresence>
	);
};

export default StockItems;

const ItemsLoading = () => {
	return (
		<AnimatePresence>
			<motion.div
				exit={preAnimationState}
				initial={preAnimationState}
				animate={animationState}
				transition={transition}
				style={{ width: '100%' }}
			>
				{times(15, (i) => (
					<div className={styles.listItem} key={i}>
						<div className={styles.listItemInner}>
							<ContentLoader
								speed={2}
								width={200}
								height={184}
								viewBox='0 0 200 184'
							>
								{/* Video */}
								<rect x='0' y='0' rx='3' ry='3' width='200' height='113' />
								{/* Tags */}
								<rect x='5' y='123' rx='3' ry='3' width='190' height='19' />
								{/* Hearts */}
								<rect x='5' y='157' rx='3' ry='3' width='37' height='17' />
								{/* Button */}
								<rect x='104' y='152' rx='3' ry='3' width='91' height='26' />
							</ContentLoader>
						</div>
					</div>
				))}
			</motion.div>
		</AnimatePresence>
	);
};
