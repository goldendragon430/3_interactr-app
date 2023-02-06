import React from 'react';
import { useReactiveVar } from '@apollo/client';

import { Icon, Modal } from 'components';
import { Button } from 'components/Buttons';
import { Option, TextInput } from 'components/PropertyEditor';

import {
	getAddModalElement,
	setAddModalElement,
	ADD_MODAL_ELEMENT_VAR_INITIAL_DATA
} from '@/graphql/LocalState/addModalElement';

import {
	IMAGE_ELEMENT,
	CUSTOM_HTML_ELEMENT,
} from 'modules/element/elements.js';

export const NameElementModal = ({ onCreate, onClose, loading}) => {
	const { showAddElementModal, newElement } = useReactiveVar(getAddModalElement);
	const { name, type } = newElement;

	const handleNext = () => {
		setAddModalElement({
			showSelectImageElementTypeModal: type === IMAGE_ELEMENT ? true : false,
			showAddFromImageLibraryModal: false,
			showAddImageFromComputerModal: false,
			showAddHtmlElementModal: type === CUSTOM_HTML_ELEMENT ? true : false,
			showAddElementModal: type !== CUSTOM_HTML_ELEMENT && type !== IMAGE_ELEMENT ? true : false,
		});
	};

	return (
		<Modal
			height={250}
			width={500}
			show={showAddElementModal}
			onClose={onClose}
			onBack={onClose}
			closeMaskOnClick={false}
			heading={
				<>
					<Icon name={'plus'} />
					New Element Wizard
				</>
			}
			submitButton={
				type === CUSTOM_HTML_ELEMENT || type === IMAGE_ELEMENT ? (
					<Button icon='arrow-right' primary onClick={handleNext} noMarginRight>
						Next
					</Button>
				) : (
					<Button
						loading={loading}
						icon='plus'
						primary
						onClick={onCreate}
						noMarginRight
					>
						Create Element
					</Button>
				)
			}
		>
			<Option
				label='Give your element a name'
				value={name}
				Component={TextInput}
				onEnter={
					type === CUSTOM_HTML_ELEMENT || type === IMAGE_ELEMENT
						? handleNext
						: onCreate
				}
				onChange={(val) =>
					setAddModalElement({
						newElement: {
							...newElement,
							name: val,
						},
					})
				}
			/>
		</Modal>
	);
};