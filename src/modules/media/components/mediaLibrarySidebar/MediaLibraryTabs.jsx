import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import ContentLoader from 'react-content-loader';
import times from 'lodash/times';

import { ErrorMessage } from 'components';
import { MediaCards } from '../MediaCards';
import VideosPaginator from '../VideosPaginator';
import { useMediaLibraryRoute } from 'modules/media/routeHooks';
import { useMedias } from '@/graphql/Media/hooks';

export const MEDIA_LIBRARY_QUERY_PARAMS = {
	first: 30,
	orderBy: 'created_at',
	sortOrder: 'DESC',
};

const tabAnimation = {
	animate: { y: 0, opacity: 1 },
	initial: { y: 25, opacity: 0 },
	transition: { type: 'spring', duration: 0.2, bounce: 0.5, damping: 15 },
};

export const MediaLibraryTabs = () => {
	const [{ isOpen, activeTab, page, q, filterBy }] = useMediaLibraryRoute();
	const [medias, , { loading, error, refetch }] = useMedias({
		...MEDIA_LIBRARY_QUERY_PARAMS,
		q,
		filterBy,
		page: parseInt(page),
	});
	
	useEffect(() => {
		(async function () {
			await refetch();
		})();
	}, [isOpen]);

	if (error) {
		return <ErrorMessage error={error} />;
	}

	if (loading) {
		return <TabLoading />;
	}

	return (
		<Tab
			loading={loading}
			medias={medias}
			filterBy={filterBy}
			activeTab={activeTab}
			page={page}
		/>
	);
};

const Tab = ({ medias, filterBy, page }) => {
	const [, setMediaRouteParams] = useMediaLibraryRoute();

	const items = medias?.data;
	const paginatorInfo = medias?.paginatorInfo;

	return (
		<motion.div {...tabAnimation}>
			{!items.length && <NoMediaInProject message='No search results.' />}
			<MediaCards items={items} librarySidebar={true} />
			<VideosPaginator
				page={page}
				paginatorInfo={paginatorInfo}
				onChange={(page) => setMediaRouteParams({ page, filterBy })}
			/>
		</motion.div>
	);
};

const TabLoading = () => {
	const styles = {
		borderBottom: '2px solid rgb(243, 246, 253)',
		height: '67px',
		position: 'relative',
		marginRight: '15px',
	};
	return (
		<motion.div {...tabAnimation}>
			{times(10, () => (
				<div style={styles}>
					<ContentLoader speed={2} width={470} height={67} viewBox='0 0 470 67'>
						{/* Only SVG shapes */}
						<rect x='5' y='7' rx='3' ry='3' width='90' height='50' />
						<rect x='100' y='15' rx='3' ry='3' width='150' height='15' />
						<rect x='100' y='39' rx='3' ry='3' width='180' height='10' />
						<rect x='292' y='15' rx='3' ry='3' width='40' height='30' />
						<rect x='345' y='20' rx='3' ry='3' width='120' height='20' />
					</ContentLoader>
				</div>
			))}
		</motion.div>
	);
};

const NoMediaInProject = ({ message }) => {
	return (
		<div style={{ paddingRight: '20px' }}>
			<p>{message}</p>
			<p>
				Click the add new media button above or drag and drop files onto here to
				add media.
			</p>
		</div>
	);
};
