import React, { useState } from 'react';
import { useReactiveVar } from '@apollo/client';

import {
	setEditPopup,
	SHOW_EDIT_POPUP_MODAL,
} from '@/graphql/LocalState/editPopup';

import {
	getAddModal,
	setAddModal,
	ADD_MODAL_VAR_INITAL_DATA,
} from '@/graphql/LocalState/addPopup';
import { Modal } from 'components';
import { Button } from 'components/Buttons';
import { errorAlert, getAsset } from 'utils';
import { Option, TextInput } from 'components/PropertyEditor';
import { useModalCommands } from '@/graphql/Modal/hooks';
import client from '@/graphql/client';
import { GET_MODALS } from '@/graphql/Modal/queries';
import ModalPreview from '../ModalPreview';
import {useLocation} from "react-router-dom";
import {toast} from 'react-toastify'


const AddPopupNameModal = ({ onClose }) => {
	const { showPopupNameModal, newModalObject, currentModalId, projectId } =
		useReactiveVar(getAddModal);

	const { createModal, applyTemplate } = useModalCommands();

	const [loading, setLoading] = useState(false);

	const [name, setName] = useState('');

	const location = useLocation();

	const goBack = () => {
		setName('');
		setAddModal({
			showSelectFromPopupTemplatesModal: newModalObject ? true : false,
			showSelectFromProjectPopupsModal: currentModalId ? true : false,
			showSelectPopupTypeModal:
				!newModalObject && !currentModalId ? true : false,
			showPopupNameModal: false,
			currentModalId: null,
			newModalObject: null,
			isPopupSelected: false,
		});
	};

	const handleSubmit = async () => {
		if (!name) {
			errorAlert({ text: 'Please enter a name for this popup' });
			return;
		}

		try {
			setLoading(true);
			let newModal = false;
			let modalId = currentModalId;
			
			if (!modalId) {
				const req = await createModal({
					variables: {
						input: {
							name,
							project_id: parseInt(projectId),
						},
					},
				});

				modalId = req.data.result.id;
				newModal = req.data.result;
			}

			if (newModalObject && newModalObject.id) {
				const req1 = await applyTemplate({
					variables: {
						input: {
							modalId: parseInt(modalId),
							templateId: parseInt(newModalObject.id),
						},
					},
				});

				modalId = req1.data.result.id;
				newModal = req1.data.result;
			}

			const variables = {
				project_id: parseInt(projectId),
			};

			const query = client.readQuery({
				query: GET_MODALS,
				variables,
			});

			// We only need to update the query if we actually have the query in the cache otherwise
			// we can ignore this part
			if (query) {
				const { result } = query;
				client.writeQuery({
					query: GET_MODALS,
					variables,
					data: {
						result: [newModal, ...result],
					},
				});
			}

			if(location.pathname.includes('/popups')) {
				setAddModal({
					...ADD_MODAL_VAR_INITAL_DATA,
					// newModalObject: newModal,
					// currentModalId: modalId,
					// isPopupSelected: true,
				});
			} else {
				// setAddModal({
				// 	...ADD_MODAL_VAR_INITAL_DATA,
				// 	showSelectFromProjectPopupsModal: true,
				// 	projectId: parseInt(projectId)
				// });

				setAddModal({
					...ADD_MODAL_VAR_INITAL_DATA,
					newModalObject: { ...newModal },
					isPopupSelected: true,
					projectId: parseInt(projectId)
				});

				setEditPopup({
					activeModal: SHOW_EDIT_POPUP_MODAL,
					modal: { ...newModal },
				});

			}
			toast.success('Successfully Created.')
			setLoading(false);
			setName('');
		} catch (err) {
			console.error(err);
			errorAlert({ text: 'Unable to create popup' });
			setLoading(false);
		}
	};

	return (
		<>
		 {
			showPopupNameModal && 
			<Modal
				height={610}
				width={1122}
				show={showPopupNameModal}
				onClose={onClose}
				onBack={goBack}
				heading={'Select a Popup'}
			>
				{showPopupNameModal && (
					<div className={'grid'}>
						<div className={'col6'}>
							{newModalObject ? (
								<ModalTemplatePreview modal={newModalObject} />
							) : (
								<NoTemplatePreview />
							)}
						</div>
						<div className={'col6'} style={{ paddingTop: '160px' }}>
							<Option
								label='Enter a name for the popup'
								value={name}
								Component={TextInput}
								onChange={(val) => setName(val)}
								onEnter={handleSubmit}
							/>
							<Button
								primary
								onClick={handleSubmit}
								loading={loading}
								right
								icon={'arrow-right'}
								rightIcon
							>
								Create Popup
							</Button>
						</div>
					</div>
				)}
			</Modal>
		 }
		</>
	);
};

export default AddPopupNameModal;

const ModalTemplatePreview = ({ modal }) => {
	const handlePreview = () => {
		
		var event = new CustomEvent('preview_animation', {
			detail: 'Modal:' + modal.id,
		});
		window.dispatchEvent(event);
	};

	return (
		<>
			<h3 style={{ marginTop: 0 }}>TEMPLATE NAME</h3>
			<h4>{modal.template_name}</h4>
			<ModalPreview modal={modal} width={511} height={287} scale={0.7} disabled={true}/>
			{!!modal.background_animation ? (
				<Button
					icon={'play'}
					style={{ marginTop: '10px' }}
					secondary
					onClick={handlePreview}
				>
					Preview
				</Button>
			) : null}
		</>
	);
};

const NoTemplatePreview = () => {
	return (
		<>
			<h3 style={{ marginTop: 0 }}>TEMPLATE NAME</h3>
			<h4>No Template Selected</h4>
			<img
				style={{ height: '287px', width: '511px' }}
				src={getAsset('/img/blank-template-image.png')}
			/>
		</>
	);
};
