import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useReactiveVar } from '@apollo/client';

import { Icon, Modal } from 'components';
import { Button } from 'components/Buttons';
import { Option, TextInput } from 'components/PropertyEditor';
import { errorAlert } from 'utils';
import { useSaveMedia } from '@/graphql/Media/hooks';
import DropImageZone from './DropImageZone';
import {toast} from 'react-toastify'
import {
	getEditMedia,
	setEditMedia,
	SHOW_REPLACE_MEDIA_MODAL,
} from '@/graphql/LocalState/editMedia';

/**
 * Open popup to update media source or thumbnail (depends media video or image)
 *
 * @param closeModal
 * @param media
 * @returns {*}
 * @constructor
 */
export const ReplaceMediaSourceModal = () => {
	const [updateMedia, { loading }] = useSaveMedia();
	const { media, activeModal } = useReactiveVar(getEditMedia);
	const [source, setSource] = useState('');
	const [thumbnail, setThumbnail] = useState('');
	console.log(media);
	useEffect(() => {
		setSource(media?.manifest_url);
	}, [media]);

	const updateSourceUrl = async () => {
		await saveMedia({
			manifest_url: source,
		});
		toast.success('Success')
	};

	const updateThumbnail = async () => {
		await saveMedia({
			thumbnail_url: thumbnail,
		});
		toast.success('Success')
	};

	const saveMedia = async (data) => {
		try {
			await updateMedia({
				id: Number(media.id),
				...data,
			});
			toast.success('Success')
			handleClose();
		} catch (error) {
			errorAlert({ text: error });
		}
	};

	const getPopupHeight = () => {
		// if needs to update media thumbnail_url
		if (media?.isImage) {
			if (media?.thumbnail || media?.thumbnailUploaded) return 570;
			// if there is no thumbnail_url, small height is looking better
			return 315;
		}
		// if opened for updating media source (manifest_url)
		return 255;
	};

	const handleClose = () => {
		setEditMedia({
			activeModal: '',
			media: null,
		});
	};

	return (
		<Modal
			show={activeModal === SHOW_REPLACE_MEDIA_MODAL}
			height={getPopupHeight()}
			width={450}
			onClose={handleClose}
			onBack={handleClose}
			heading={
				media?.isImage ? (
					<>
						<Icon name='cloud-upload' /> Replace Media Image
					</>
				) : (
					<>
						<Icon name='sync' /> Replace Media Source
					</>
				)
			}
			submitButton={
				<Button
					icon='save'
					primary
					right
					loading={loading}
					onClick={media?.isImage ? updateThumbnail : updateSourceUrl}
				>
					Save
				</Button>
			}
		>
			<div className='grid'>
				<div className='col12' style={{ marginBottom: '20px' }}>
					{media?.isImage ? (
						<DropImageZone
							src={media?.thumbnail}
							onSuccess={({ src }) => setThumbnail(src)}
							directory='thumbnails'
						/>
					) : (
						<Option
							label='Media Source'
							value={source}
							onChange={(val) => setSource(val)}
							onEnter={media?.isImage ? updateThumbnail : updateSourceUrl}
							Component={TextInput}
						/>
					)}
				</div>
			</div>
		</Modal>
	);
};

ReplaceMediaSourceModal.propTypes = {
	show: PropTypes.bool,
	closeModal: PropTypes.func,
	media: PropTypes.object || null,
};
