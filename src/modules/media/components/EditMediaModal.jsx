import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useReactiveVar } from '@apollo/client';

import { Button } from 'components/Buttons';
import { Icon, Modal, VideoPlayer } from 'components';
import { Option, TextInput } from 'components/PropertyEditor';
import { useSaveMedia } from '@/graphql/Media/hooks';
import { errorAlert } from 'utils';
import {
	getEditMedia,
	setEditMedia,
	SHOW_EDIT_MEDIA_MODAL,
} from '@/graphql/LocalState/editMedia';

/**
 * Show popup for updating/deleting the single media item
 * @param media
 * @param closeModal
 * @returns {null|*}
 * @constructor
 */
export const EditMediaModal = () => {
	const [updateMedia, { loading }] = useSaveMedia();
	const { media, activeModal } = useReactiveVar(getEditMedia);
	const [name, setName] = useState('');

	useEffect(() => {
		setName(media?.name);
	}, [media]);

	const getVideoURL = () => {
		return media?.url || media?.manifest_url;
	};

	const handleUpdateMedia = async () => {
		try {
			await updateMedia({
				id: Number(media.id),
				name,
			});

			handleClose();
		} catch (error) {
			errorAlert({ text: error });
		}
	};

	const handleClose = () => {
		setEditMedia({
			activeModal: '',
			media: null,
		});
	};

	return (
		<Modal
			show={activeModal === SHOW_EDIT_MEDIA_MODAL}
			onClose={handleClose}
			onBack={handleClose}
			height={475}
			heading={
				<>
					<Icon name={'pen-square'} /> Edit Media
				</>
			}
			submitButton={
				<Button
					icon='save'
					primary
					right
					loading={loading}
					onClick={handleUpdateMedia}
				>
					Save
				</Button>
			}
		>
			<div className='grid'>
				<div className='col12' style={{ marginBottom: '20px' }}>
					<VideoPlayer
						url={getVideoURL()}
						videoId={media?.id}
						imageURL={media?.thumbnail_url}
						controls
						light={media?.thumbnail_url || false} // stops preload and only shows thumbnail awesome for perf
					/>
				</div>

				<div className='col12'>
					<div className='form-control'>
						<Option
							type='text'
							value={name}
							Component={TextInput}
							onChange={(val) => setName(val)}
							onEnter={handleUpdateMedia}
						/>
					</div>
				</div>
			</div>
		</Modal>
	);
};

EditMediaModal.propTypes = {
	state: PropTypes.object,
	setState: PropTypes.func,
};
