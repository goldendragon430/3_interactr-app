import React, { useState } from 'react';
import gql from 'graphql-tag';
import { useQuery, useReactiveVar } from '@apollo/client';

import { Icon, Modal } from 'components';
import { Button } from 'components/Buttons';
import { getUserAvatar, setUserAvatar } from '@/graphql/LocalState/userAvatar';
import { useUserCommands } from '@/graphql/User/hooks';
import { errorAlert, getAsset } from 'utils';
import DropImageZone from 'modules/media/components/DropImageZone';

const QUERY = gql`
	query AuthUser {
		result: me {
			id
			avatar_url
		}
	}
`;

export const UploadUserAvatarModal = () => {
	const { showUserAvatarModal } = useReactiveVar(getUserAvatar);

	const { data, loading, error } = useQuery(QUERY);

	const { saveUser, updateUser } = useUserCommands();

	const [saving, setSaving] = useState(false);
	const [saveEnable,setSaveEnable] = useState(false)
	if (loading || error) return null;

	const { avatar_url, id } = data.result;

	const userAvatar = avatar_url ? avatar_url : getAsset('/img/avatar-logo.png');

	// Save the user changes in the cache
	const handleUpload = ({ src }) => {
		updateUser({
			id,
			avatar_url: src,
		});
		setSaveEnable(true)
	};

	const handleError = (error) => {
		return errorAlert({
			title: 'File Upload Error',
			text: error,
		});
	};

	// Close the modal
	const handleClose = () => setUserAvatar({ showUserAvatarModal: false });

	// Submit the changes to the BE
	const handleSubmit = async () => {
		setSaving(true);
		try {
			await saveUser({
				variables: {
					input: {
						id,
						avatar_url,
					},
				},
			});
			handleClose();
		} catch (err) {
			console.error(e);
			errorAlert({ text: 'Unable to save changes' });
		}
		setSaving(false);
	};

	return (
		<Modal
			show={showUserAvatarModal}
			height={360}
			width={600}
			onClose={handleClose}
			closeMaskOnClick={false}
			heading={
				<>
					<Icon name='cloud-upload' /> Update Avatar
				</>
			}
			submitButton={
				<Button primary onClick={handleSubmit} icon={'save'} loading={saving}  disabled = {!saveEnable}>
					Save Changes
				</Button>
			}
		>
			<div className={'grid'}>
				<div className={'col4'}>
					<label>Current Avatar</label>
					<img
						src={userAvatar}
						style={{ borderRadius: '10px', maxWidth: '100px', float: 'left' }}
					/>
				</div>
				<div className={'col8'} style={{ paddingBottom: 10 }}>
					<label>Replace Avatar</label>
					<DropImageZone
						onSuccess={handleUpload}
						onError={handleError}
						directory='thumbnails'
						style={{ height: '265px' }}
					/>
				</div>
			</div>
		</Modal>
	);
};
export default UploadUserAvatarModal;