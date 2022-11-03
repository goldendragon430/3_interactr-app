import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

import {
	MediaLibraryLoading,
	NoMedia,
	tabAnimation,
	ALL_ACTIVE_TAB,
	VIDEOS_ACTIVE_TAB,
} from './index';
import { MediaCards } from '../MediaCards';
import VideosPaginator from '../VideosPaginator';
import { useVideosPageRoute } from '../../routeHooks';
import { useMedias } from '@/graphql/Media/hooks';

/**
 * Render media items in media library page
 *
 * @returns {*}
 * @constructor
 */
export const MediaLibraryMediaList = () => {
	const [
		{ page, q, orderBy, project_id, filterBy, activeTab },
		setVideosPageParams,
	] = useVideosPageRoute();
	const [media, , { loading, refetch }] = useMedias({
		q,
		page: parseInt(page),
		orderBy,
		id: project_id,
		filterBy,
	});

	const videos = media?.data || [];
	const paginatorInfo = media?.paginatorInfo || {};

	useEffect(() => {
		if (media && !media.data.length && Number(page) > 1) {
			setVideosPageParams({
				q,
				page: Number(page) - 1,
				orderBy,
				id: project_id,
				filterBy,
			});
		}
	}, [media, page]);

	if (loading) return <MediaLibraryLoading tabAnimation={tabAnimation} />;

	let items = [];
	activeTab === ALL_ACTIVE_TAB
		? (items = videos)
		: activeTab === VIDEOS_ACTIVE_TAB
		? (items = videos.filter((item) => item.is_image === 0))
		: (items = videos.filter((item) => item.is_image === 1));

	return (
		<motion.div {...tabAnimation}>
			{!items.length ? (
				<NoMedia message='No search results.' />
			) : (
				<>
					<MediaCards items={items} refetch={refetch} />
					<VideosPaginator
						page={page}
						paginatorInfo={paginatorInfo}
						onChange={(page) => setVideosPageParams({ page, filterBy })}
					/>
				</>
			)}
		</motion.div>
	);
};
