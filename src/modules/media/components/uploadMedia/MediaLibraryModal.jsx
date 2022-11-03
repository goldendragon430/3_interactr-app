import React, { useEffect, useState } from 'react';
import styles from './StockListModalStyles.module.scss';
import Icon from 'components/Icon';
import { useSetState } from '../../../../utils/hooks';
import { useAuthUser } from '../../../../graphql/User/hooks';
import VideosPaginator from '../VideosPaginator';
import { useMediaLibraryRoute } from '../../routeHooks';
import size from 'lodash/size';
import MediaLibraryList from './MediaLibraryList';
import { useLazyQuery, useQuery, useReactiveVar } from '@apollo/client';
import {
	getAddMedia,
	setAddMedia,
	SHOW_MEDIA_NAME_MODAL,
	SHOW_THUMBNAIL_SELECT_MODAL,
	SHOW_UPLOAD_FROM_FILE_MODAL,
	SHOW_UPLOAD_FROM_LIBRARY_MODAL,
} from '../../../../graphql/LocalState/addMedia';
import Modal from '../../../../components/Modal';
import { GET_MEDIAS } from '../../../../graphql/Media/queries';
import ErrorMessage from '../../../../components/ErrorMessage';
import { AnimatePresence, motion } from 'framer-motion';
import {
	animationState,
	preAnimationState,
	transition,
} from '../../../../components/PageBody';
import times from 'lodash/times';
import ContentLoader from 'react-content-loader';
import { useParams } from 'react-router-dom';
import filter from 'lodash/filter';

/**
 * Create new media by selecting one of existing media items in popup
 * @param close
 * @param isLegacyProject
 * @returns {*}
 * @constructor
 */
const MediaLibraryModal = ({ onError, onClose, onNext, onBack }) => {
	const { activeModal, newMediaObject } = useReactiveVar(getAddMedia);

	const [{ activeTab }] = useMediaLibraryRoute();

	const [params, setParams] = useSetState({
		page: 1,
		first: 15,
		search: '',
		hidden: 0,
		orderBy: 'created_at',
		sortOrder: 'DESC',
	});

	const user = useAuthUser();

	const [search, setSearch] = useState('');

	/**
	 * Use a lazy query so the query doesn't run until the modal is opened
	 */
	const [getMedias, { data, loading, error, refetch, called }] =
		useLazyQuery(GET_MEDIAS);

	useEffect(() => {
		if (activeModal === SHOW_UPLOAD_FROM_LIBRARY_MODAL && !called) {
			// Modal is open and the query hasn't been called
			getMedias({
				variables: {
					...params,
					...{ not_project_id: newMediaObject?.project_id },
				},
			});
		}
	}, [activeModal]);

	const onSuccess = (media) => {
		setAddMedia({
			newMediaObject: {
				is_image: media.is_image,
				url: media.url,
				thumbnail_url: media.thumbnail_url,
				manifest_url: media.manifest_url
			},
		});

		const nextModal = media.is_image
			? SHOW_MEDIA_NAME_MODAL
			: SHOW_THUMBNAIL_SELECT_MODAL;

		onNext(nextModal, SHOW_UPLOAD_FROM_LIBRARY_MODAL);
	};

	return (
		<Modal
			show={activeModal === SHOW_UPLOAD_FROM_LIBRARY_MODAL}
			onBack={() => onBack('showUploadFromLibraryModal')}
			onClose={onClose}
			height={750}
			width={1200}
			closeMaskOnClick={false}
			heading={
				<>
					<Icon name='list' /> Your Media Library
				</>
			}
			submitButton={
				called ? (
					<Pagination
						loading={loading}
						error={error}
						data={data}
						params={params}
						setParams={setParams}
						refetch={refetch}
					/>
				) : null
			}
		>
			<div className={styles.filterWrapper}>
				<div style={{ width: '45%' }}>
					<label>Search</label>
					<input
						name='filter'
						className={styles.filterInput}
						onChange={(e) => setSearch(e.target.value)}
						onKeyPress={(e) =>
							e.key === 'Enter' ? refetch({ ...params, page: 1, search }) : null
						}
						placeholder='Filter by name'
					/>
				</div>
			</div>
			<div className={styles.fromLibraryModalWrapper}>
				<ModalBody
					loading={loading}
					error={error}
					data={data}
					params={params}
					setParams={setParams}
					onSelect={onSuccess}
					called={called}
					projectId={newMediaObject?.project_id}
				/>
			</div>
		</Modal>
	);
};

export default MediaLibraryModal;

const ModalBody = ({ loading, error, onSelect, data, called, projectId }) => {
	if (loading || !called) {
		return <MediasLoading />;
	}

	if (error) {
		return <ErrorMessage error={error} />;
	}

	if (!size(data.result.data)) {
		return (
			<h3 className='text-center' style={{ marginTop: '225px' }}>
				You have no Media in your Media Library
			</h3>
		);
	}

	return (
		<div className={styles.mediaLibraryListWrapper}>
			<MediaLibraryList medias={data.result.data} onSelect={onSelect} />
		</div>
	);
};

const MediasLoading = () => {
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

const Pagination = ({ data, loading, error, params, setParams, refetch }) => {
	if (loading || error) return null;

	const { page } = params;

	return (
		<span className={styles.mediaModalPagination}>
			<VideosPaginator
				page={page}
				paginatorInfo={data.result.paginatorInfo}
				onChange={(page) => {
					refetch({
						...params,
						page,
					});
					setParams({ page });
				}}
			/>
		</span>
	);
};
