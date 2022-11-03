import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';
import Modal from 'components/Modal';

import { Icon } from 'components';
import { errorAlert } from 'utils/alert';
import { Button } from 'components/Buttons';
import { Option, TextInput } from 'components/PropertyEditor';
import { GET_MODALS } from '@/graphql/Modal/queries';
import { useModalCommands } from '@/graphql/Modal/hooks';

export const ModalsListItemCopy = ({ show, setShow, idToCopy }) => {
	const { copyModal } = useModalCommands();
	const [copying, setCopying] = useState(false);
	const { projectId } = useParams();
	const [name, setName] = useState('');

	const handleCopy = async () => {
		try {
			setCopying(true);
			const req = await copyModal({
				variables: {
					input: {
						modalId: Number(idToCopy),
						project_id: Number(projectId),
						name,
					},
				},
				update: (cache, { data }) => {
					const newModal = data?.result;

					const currentModals = cache.readQuery({
						query: GET_MODALS,
						variables: {
							project_id: Number(projectId),
						},
					});
					console.log(currentModals);
					cache.writeQuery({
						query: GET_MODALS,
						variables: {
							project_id: Number(projectId),
						},
						data: {
							result: [newModal, ...currentModals?.result],
						},
					});
				},
			});
			setName('');
			setShow(false);
		} catch (err) {
			console.error(err);
			errorAlert({ text: 'Unable to copy popup' });
		}
		setCopying(false);
	};

	return (
		<Modal
			show={show}
			onClose={() => setShow(false)}
			height={275}
			width={500}
			heading={<><Icon name={'copy'} /> Copy Popup</>}
			submitButton={
				<Button icon={'copy'} primary onClick={handleCopy} loading={copying}>
					Copy
				</Button>
			}
		>	
			<Option
				label='Enter a name for your new popup'
				Component={TextInput}
				value={name}
				onChange={setName}
				onEnter={handleCopy}
			/>
		</Modal>
	);
};

ModalsListItemCopy.propTypes = {
	show: PropTypes.bool.isRequired,
	setShow: PropTypes.func.isRequired,
	idToCopy: PropTypes.string.isRequired,
};
