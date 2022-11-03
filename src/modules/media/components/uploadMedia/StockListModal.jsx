import React, { useState } from 'react';
import Button from 'components/Buttons/Button';
import Icon from 'components/Icon';
import styles from './StockListModalStyles.module.scss';
import StockListCategoryFilter from '../StockListCategoryFilter';
import Spinner from 'components/Spinner';
import { Link } from 'react-router-dom';
import {
	DEFAULT_STOCK_VIDEOS_REQUEST_PARAMS,
	useStockVideos,
} from '../../utils';
import { useAuthUser } from '../../../../graphql/User/hooks';
import _size from 'lodash/size';
import StockItems from './StockItems';
import StockItemsPaginator from './StockItemsPaginator';
import StockListMediaFilter from '../StockListMediaFilter';
import { useReactiveVar } from '@apollo/client';
import {
	getAddMedia,
	setAddMedia,
	SHOW_MEDIA_NAME_MODAL,
	SHOW_THUMBNAIL_SELECT_MODAL,
	SHOW_UPLOAD_FROM_FILE_MODAL,
	SHOW_UPLOAD_FROM_STOCK_MODAL,
} from '../../../../graphql/LocalState/addMedia';
import Modal from '../../../../components/Modal';
import MessageBox from '../../../../components/MessageBox';

const StockListModal = ({ onClose, onNext, onError, onBack }) => {
	const user = useAuthUser();
	const [search, setSearch] = useState('');
	const { activeModal } = useReactiveVar(getAddMedia);
	const [
		getStockItems,
		{
			loadingVideos,
			items,
			page,
			totalCount,
			error: errorStockVideos,
			isImages,
		},
	] = useStockVideos();

	const fetchStockItems = (params = {}) => {
		getStockItems({
			fetchImages: isImages,
			...params,
		});
	};

	const handleSelectCategory = (category) => {
		let params = DEFAULT_STOCK_VIDEOS_REQUEST_PARAMS;

		if (category !== 'No Category') {
			params = { category, page: 1 };
		}

		fetchStockItems(params);
	};

	const handleSelectType = (type) => {
		fetchStockItems({ fetchImages: type });
	};

	const onSelect = (newMediaObject) => {

		setAddMedia({ newMediaObject });

		const nextModal = newMediaObject.is_image
			? SHOW_MEDIA_NAME_MODAL
			: SHOW_THUMBNAIL_SELECT_MODAL;

		onNext(nextModal, SHOW_UPLOAD_FROM_STOCK_MODAL);
	};

	return (
		<Modal
			show={activeModal === SHOW_UPLOAD_FROM_STOCK_MODAL}
			onBack={() => onBack('showUploadFromStockModal')}
			onClose={onClose}
			height={760}
			width={1200}
			closeMaskOnClick={false}
			heading={
				<>
					<Icon name='list' /> Stock Library
				</>
			}
			submitButton={
				<>
					{!loadingVideos && (
						<StockItemsPaginator
							paginatorInfo={{
								count: _size(items),
								total: totalCount,
								perPage: 20,
								page,
							}}
							onChange={(page) => fetchStockItems({ page })}
						/>
					)}
				</>
			}
		>
			<div className={styles.filterWrapper}>
				<div className={styles.filterLeftWrapper}>
					Search:{' '}
					<input
						name='filter'
						className={styles.filterInput}
						onChange={(e) => setSearch(e.target.value)}
						onKeyPress={(e) =>
							e.key === 'Enter' ? fetchStockItems({ page: 1, q: search }) : null
						}
						placeholder='Filter by tags'
					/>
				</div>
				<div className={styles.filterLeftWrapper}>
					Categories:
					<StockListCategoryFilter onChange={handleSelectCategory} />
				</div>
				<div className={styles.filterRightWrapper}>
					Media Type:
					<StockListMediaFilter onChange={handleSelectType} />
				</div>
			</div>
			<div>
				<div className={styles.listWrapper}>
					<StockItems
						isImages={isImages}
						onSelect={onSelect}
						user={user}
						items={items}
						loading={loadingVideos}
					/>
				</div>
			</div>
		</Modal>
	);
};

export default StockListModal;
