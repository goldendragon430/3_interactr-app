import React, { useEffect, useState } from 'react';
import { Option, TextInput } from '../../../../components/PropertyEditor';
import ModalPreview from '../ModalPreview';
import { useQuery } from '@apollo/client';
import { GET_MODAL } from '../../../../graphql/Modal/queries';
import Button from '../../../../components/Buttons/Button';
import { errorAlert } from '../../../../utils/alert';
import { useParams } from 'react-router-dom';
import { useModalCommands } from '../../../../graphql/Modal/hooks';
import getAsset from '../../../../utils/getAsset';

const SelectModalStepThree = ({ setState, state, onChange }) => {
	const [saving, setSaving] = useState(false);
	const { template, hideModal } = state;
	const { projectId } = useParams();
	const [name, setName] = useState('');

	useEffect(() => {
		setState({
			modalHeight: 610,
			modalWidth: 1122,
		});
	}, []);

	const { createModal, applyTemplate } = useModalCommands();

	const handleSubmit = async () => {
		try {
			setSaving(true);

			let currentModalId = state.currentModalId;

			if (!currentModalId) {
				const req = await createModal({
					variables: {
						input: {
							name,
							project_id: parseInt(projectId),
						},
					},
				});

				currentModalId = req.data.result.id;
			}

			if (state.template) {
				// Modal p exists so we need to apply the template
				const req2 = await applyTemplate({
					variables: {
						input: {
							modalId: parseInt(currentModalId),
							templateId: parseInt(state.template.id),
						},
					},
				});
			}

			await onChange(currentModalId);
			hideModal();
		} catch (err) {
			console.error(err);
			errorAlert({ text: 'Unable to create popup' });
		}
		setSaving(false);
	};

	return (
		<div className={'grid'}>
			<div className={'col6'}>
				{template ? (
					<ModalTemplatePreview modal={template} />
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
					loading={saving}
					right
					icon={'arrow-right'}
					rightIcon
				>
					Create Popup
				</Button>
			</div>
		</div>
	);
};
export default SelectModalStepThree;

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
			<Button
				icon={'play'}
				style={{ marginTop: '10px' }}
				secondary
				onClick={handlePreview}
				tooltip={'Preview Animations (Not all popups will have animations)'}
			>
				Preview
			</Button>
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
