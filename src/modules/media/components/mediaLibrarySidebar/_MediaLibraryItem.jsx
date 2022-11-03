import React, { useState, useEffect, useContext } from 'react';
import styles from './MediaLibraryItem.module.scss';
import Icon from 'components/Icon';
import CloneOnDrag from 'components/CloneOnDrag';
import MediaItemMenu from './MediaItemMenu';
import PropTypes from 'prop-types';
import { confirm, errorAlert } from '../../../../utils/alert';
import cardstyles from '../../../../components/Card.module.scss';
import { COMPOSER_DOM_ID } from '@/graphql/LocalState/composer';
import { getRelativeDrop } from 'modules/composer/dragging';
import ProjectCanvasContext from 'modules/project/components/ProjectCanvasContext';
import {
	useDeleteMedia,
	useMediaSubscription,
} from '../../../../graphql/Media/hooks';
import { EditMediaModal } from '../EditMediaModal';
import ReplaceMediaSourceModal from '../ReplaceMediaSourceModal';

const _props = {
	/** The currently selected project */
	project: PropTypes.object.isRequired,
	/** The media library item */
	item: PropTypes.object.isRequired,
};

const MediaLibraryItem = ({ item, project }) => {
	const { dropMediaOnCanvas } = useContext(ProjectCanvasContext);
	// Handle the media item sub menu for deleting / renaming
	// the media item
	const [showMenu, toggleMenu] = useState(false);
	const [deleteMedia, { loading }] = useDeleteMedia();
	const [media, { loading: mediaLoading, error: mediaError }] =
		useMediaSubscription(item.id);

	// Handle the edit and replace modal show state
	const [showEditModal, openEditModal] = useState(false);
	const [showReplaceModal, openReplaceModal] = useState(false);

	if (loading) return <Icon loading />;

	const deleteItem = async () => {
		try {
			await deleteMedia(null, item.id);
		} catch (error) {
			errorAlert({ text: error });
		}
	};

	// When we delete an item ensure the
	// menu is hidden.
	useEffect(() => {
		toggleMenu(false);
	}, [item]);

	const dragStop = (e) => {
		// Make sure it's a drop on the composer
		const acceptedDrop = getRelativeDrop(COMPOSER_DOM_ID, e);
		if (!acceptedDrop) return;
		dropMediaOnCanvas(item, acceptedDrop);
	};

	return (
		<div className={styles.MediaItemWrapper}>
			<div
				className={cardstyles.Card}
				style={{ marginBottom: '15px', overflow: 'visible' }}
			>
				<CloneOnDrag onStop={dragStop} offset={{ x: 5, y: 0 }}>
					<div className={styles.MediaItem}>
						<Thumbnail item={item} project={project} />
					</div>
				</CloneOnDrag>
				<div
					className={styles.mediaTitle}
					onClick={() => toggleMenu(!showMenu)}
				>
					<span>{item.name}</span>
					<span className={styles.editIcon}>
						<Icon loading={loading} name='ellipsis-v' />
					</span>
				</div>

				{/* Popup menu for media item */}
				<MediaItemMenu
					item={item}
					showMenu={showMenu}
					deleteMediaItem={() => deleteConfirm(deleteItem)}
					openEditModal={() => openEditModal(true)}
					openReplaceModal={() => openReplaceModal(true)}
				/>

				{/* Edit Modal allows users to change the name of the media item */}
				<EditMediaModal
					show={showEditModal}
					selectedMedia={item}
					closeModal={() => {
						openEditModal(false);
						toggleMenu(false);
					}}
				/>

				<ReplaceMediaSourceModal
					show={showReplaceModal}
					media={item}
					closeModal={() => {
						openReplaceModal(false);
						toggleMenu(false);
					}}
				/>
			</div>
		</div>
	);
};

function Thumbnail({ item, project }) {
	// If we have a thumbnail URL nothing else matter we can display it
	if (item.thumbnail_url) {
		return (
			<img
				draggable={false}
				className={styles.image}
				src={item.thumbnail_url}
			/>
		);
	}

	// If we don't the media item is in some stage of processing. We handle this
	// differently based on legacy and ! legacy
	// if ( ! project.is_legacy ) return <EncodeMediaItem
	//     id={project.id}
	//     mediaName={project.name}
	//     isLegacyProject={project.is_legacy}
	// />;

	return <GeneratingThumbnail />;
}

function GeneratingThumbnail() {
	return (
		<div className={styles.generatingThumb}>
			<Icon spin name='circle-notch' />
			<p>
				<small>Generating Thumbnail</small>
			</p>
		</div>
	);
}

function deleteConfirm(deleteItem) {
	confirm({
		title: 'Are You Sure!',
		text: 'Are You Sure You Want To Delete This Video?',
		confirmButtonText: 'Yes, Delete It!',
		onConfirm: async () => {
			await deleteItem();
			close();
		},
	});
}

MediaLibraryItem.propTypes = _props;
export default MediaLibraryItem;
