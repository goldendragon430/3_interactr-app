import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import ReactTooltip from 'react-tooltip';

import { getAsset } from 'utils';
import { Icon } from 'components';
import { confirm, errorAlert } from 'utils/alert';
import { useDeleteMedia } from '@/graphql/Media/hooks';
import { MediaViews } from './MediaViews';

/**
 * Single media item card
 * @param media
 * @param onUpdate
 * @param onDelete
 * @param replaceMediaSource
 * @param deleting
 * @returns {*}
 * @constructor
 */
export const MediaCard = ({ media, onUpdate, replaceMediaSource, refetch }) => {
	const [deleteMedia, { loading: deleting, error: deleteError }] =
		useDeleteMedia();

	const confirmDeleteMedia = (media) => {
		confirm({
			title: 'Are You Sure!',
			text: 'Are You Sure You Want To Delete This Media?',
			confirmButtonText: 'Yes, Delete It!',
			onConfirm: async () => {
				try {
					await deleteMedia(null, media.id);
					await refetch();
				} catch (err) {
					// TODO set static error while can figure out how to get exact BE error message
					errorAlert({
						text: "Can't delete media item. It is in use for other nodes.",
					});
				}
			},
		});
	};

	return (
		<li
			className='grid'
			style={{
				borderBottom: '2px solid #f3f6fd',
				height: '84px',
				position: 'relative',
			}}
		>
			<ReactTooltip className='tooltip' />
			<div className='col2'>
				<img
					src={media.thumbnail_url || getAsset('/img/no-thumbnail.png')}
					className='img-fluid '
					style={{
						borderRadius: '5px',
						boxShadow: '0 2px 5px rgba(0,0,0,.1), 0 1px 2px rgba(0,0,0,.05)',
						maxHeight: '70px'
					}}
				/>
			</div>
			<div className='col7' style={{ overflow: 'hidden' }}>
				<h2
					style={{
						marginBottom: 0,
						marginTop: '10px',
						color: '#366fe0',
						fontWeight: 500,
						cursor: 'pointer',
					}}
					onClick={onUpdate}
				>
					{media.name}
				</h2>
				<MetaRow media={media} />
			</div>
			<div className='col1 text-center' style={{ padding: 0 }}>
				<h3 style={{ marginTop: '15px' }}>
					<strong>
						<MediaViews id={media.id} />
					</strong>{' '}
					<br />
					<span style={{ opacity: 0.8 }}>Views</span>
				</h3>
			</div>
			<div className='col2 text-right' style={{ paddingTop: '28px' }}>
				<span
					style={{ cursor: 'pointer', marginRight: '15px' }}
					data-tip={'Rename'}
				>
					<Icon name={'edit'} onClick={onUpdate} />
				</span>
				<span
					style={{ cursor: 'pointer', marginRight: '15px' }}
					data-tip={'Replace Media'}
				>
					<Icon name={'sync'} onClick={replaceMediaSource} />
				</span>
				<span
					style={{ cursor: 'pointer' }}
					data-tip={'Delete'}
					onClick={() => confirmDeleteMedia(media)}
				>
					{deleting ? <Icon loading /> : <Icon name={'trash-alt'} />}
				</span>
			</div>
		</li>
	);
};

MediaCard.propTypes = {
	media: PropTypes.object.isRequired,
	onUpdate: PropTypes.func.isRequired,
	replaceMediaSource: PropTypes.func.isRequired,
	refetch: PropTypes.func.isRequired,
};

const MetaRow = ({ media }) => {
	const type = media.is_image ? 'Image' : 'Video';

	return (
		<small style={{ marginTop: '10px', opacity: 0.8 }}>
			{type} / Created {moment.utc(media.created_at).fromNow()} / Project:{' '}
			{media.project_title}
		</small>
	);
};

MetaRow.propTypes = {
	media: PropTypes.object.isRequired,
};

export default MediaCard;
