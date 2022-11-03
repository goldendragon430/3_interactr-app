import React, { useEffect, useState, useRef } from 'react';
import { useReactiveVar } from '@apollo/client';

import {
	getAddMedia,
	setAddMedia,
	SHOW_MEDIA_NAME_MODAL,
	SHOW_THUMBNAIL_SELECT_MODAL,
} from '@/graphql/LocalState/addMedia';

import { Icon, Modal, VideoPlayer } from 'components';
import { Button } from 'components/Buttons';
import { uploadFileToS3 } from '../../awsUploader';
import { errorAlert, uploadBase64 } from 'utils';
import { VideoThumbnailGenerator } from './VideoThumbnailGenerator';

import styles from './NewMediaSettingsModal.module.scss';

export const SelectVideoThumbnailModal = ({ onClose, onNext, onBack }) => {
	const { activeModal, newMediaObject } = useReactiveVar(getAddMedia);
	const [thumbnailAsBase64, setThumbnailAsBase64] = useState('');
	const [loading, setLoading] = useState(false);
	const [initLoading, setInitLoading] = useState(true);

	const onSubmit = async () => {
		setLoading(true);
		
		// const playerTag = document.getElementById('add-media-preview-player').firstChild;
		// const videoRatio = getVideoRatio(playerTag.videoWidth, playerTag.videoHeight);

		try {
			const res = await uploadBase64(thumbnailAsBase64);

			setThumbnailAsBase64(false);
			setLoading(false);

			setAddMedia({
				newMediaObject: {
					thumbnail_url: res.url,
					// media_size: videoRatio
				},
			});

			onNext(SHOW_MEDIA_NAME_MODAL, SHOW_THUMBNAIL_SELECT_MODAL);
		} catch (err) {
			console.error(err);
			errorAlert({ text: 'Error uploading thumbnail' });
			setLoading(false);
		}
	};

	const _onClose = () => {
		setLoading(false);
		setThumbnailAsBase64('');
		onClose();
	};

	const manifestUrl = newMediaObject?.manifest_url;
	const mediaUrl = newMediaObject?.temp_storage_url;
	const videoUrl = newMediaObject?.url;
	let url = mediaUrl ? mediaUrl : videoUrl;
	url = manifestUrl ? manifestUrl : url;
	
	return (
		<Modal
			height={575}
			width={1000}
			show={activeModal === SHOW_THUMBNAIL_SELECT_MODAL}
			closeMaskOnClick={false}
			onClose={_onClose}
			onBack={onBack}
			heading={
				<>
					<Icon name={'image'} /> Choose Video Thumbnail
				</>
			}
			submitButton={
				<Button primary onClick={onSubmit} loading={(loading || initLoading)}>
					Select Thumbnail&nbsp;
					{(loading || initLoading) ? <Icon loading /> : <Icon name={'arrow-right'} />}
				</Button>
			}
		>
			<div className={'grid'}>
				<div className={'col6'}>
					<label>Video</label>
					<VideoPlayer
						id={'add-media-preview-player'}
						url={url}
						imageURL={null}						
						controls
					/>
				</div>
				<div className={'col6'}>
					<label>Thumbnail</label>
					<VideoThumbnailGenerator
						url={url}
						setThumbnail={setThumbnailAsBase64}
						setInitLoading={setInitLoading}
					/>
				</div>
			</div>
			<canvas id='video-thumbnail-holder' className={styles.canvas} />
		</Modal>
	);
};

// const getVideoRatio = (width, height) => {
// 	const ratio = width / height;
// 	if(ratio >= 1.7 && ratio <= 1.8)
// 		return "16:9";
// 	if(ratio >= 1.3 && ratio <= 1.4)
// 		return "4:3";
// 	if(ratio >= 0.5 && ratio <= 0.6)
// 		return "9:16";	
// 	return "16:9";
// }