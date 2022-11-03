import React from 'react';
import PropTypes from 'prop-types';
import _map from 'lodash/map';
import { AnimateSharedLayout, motion } from 'framer-motion';

import { ReplaceMediaSourceModal } from './ReplaceMediaSourceModal';
import { MediaCard } from './MediaCard';
import MediaSidebarCard from './MediaSidebarCard';
import { useSetState } from 'utils/hooks';
import {
	setEditMedia,
	SHOW_EDIT_MEDIA_MODAL,
	SHOW_REPLACE_MEDIA_MODAL,
} from '@/graphql/LocalState/editMedia';

const listAnimations = {
	initial: {
		opacity: 1,
		y: 0,
		scale: 1,
		transition: { type: 'ease-in' },
	},
	animate: {
		opacity: 1,
		y: 0,
		transition: { type: 'ease-in', duration: 0.8 },
	},
};

const animantions = {
	hidden: { opacity: 0 },
	show: {
		opacity: 1,
		transition: {
			staggerChildren: 0.2,
		},
	},
};
/**
 * Abstract component for multiple usage on app
 * Ex. Videos Page, Media library side on canvas page
 * @param items
 * @param librarySidebar
 * @returns {*}
 * @constructor
 */
export const MediaCards = ({ items, librarySidebar = false, refetch }) => {
	const [state, setState] = useSetState({
		showEditModal: false,
		showReplaceSourceModal: false,
		selectedMedia: null,
	});
	const { showReplaceSourceModal, selectedMedia } = state;
	const ulStyles = librarySidebar ? { padding: 0 } : {};

	return (
		<>
			<AnimateSharedLayout>
				<motion.div initial='hidden' animate='show' variants={animantions}>
					{_map(items, (item) => (
						<motion.ul key={item.id} style={ulStyles} {...listAnimations}>
							{librarySidebar ? (
								<MediaSidebarCard
									media={item}
									onUpdate={() => {
										setEditMedia({
											activeModal: SHOW_EDIT_MEDIA_MODAL,
											media: item,
										});
									}}
									replaceMediaSource={() => {
										setEditMedia({
											activeModal: SHOW_REPLACE_MEDIA_MODAL,
											media: item,
										});
									}}
								/>
							) : (
								<MediaCard
									refetch={refetch}
									media={item}
									librarySidebar={librarySidebar}
									onUpdate={() => {
										setEditMedia({
											activeModal: SHOW_EDIT_MEDIA_MODAL,
											media: item,
										});
									}}
									replaceMediaSource={() => {
										setEditMedia({
											activeModal: SHOW_REPLACE_MEDIA_MODAL,
											media: item,
										});
									}}
								/>
							)}
						</motion.ul>
					))}
				</motion.div>
			</AnimateSharedLayout>

			{/* <ReplaceMediaSourceModal
				show={showReplaceSourceModal}
				media={selectedMedia}
				closeModal={() => {
					setState({
						selectedMedia: null,
						showReplaceSourceModal: false,
					});
				}}
			/> */}
		</>
	);
};

MediaCards.propTypes = {
	items: PropTypes.array.isRequired,
	librarySidebar: PropTypes.bool,
	refetch: PropTypes.func.isRequired,
};
