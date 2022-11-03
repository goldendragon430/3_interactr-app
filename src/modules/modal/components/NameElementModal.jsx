import React from 'react';
import { useReactiveVar } from '@apollo/client';

import { Icon, Modal } from 'components';
import { Button } from 'components/Buttons';
import { Option, TextInput } from 'components/PropertyEditor';
import { errorAlert } from '../../../utils/alert';
import {
	getAddModalElement,
	setAddModalElement,
	ADD_MODAL_ELEMENT_VAR_INITIAL_DATA
} from '@/graphql/LocalState/addModalElement';
import {
	getEditPopup,
} from '@/graphql/LocalState/editPopup';

import {
	IMAGE_ELEMENT,
	CUSTOM_HTML_ELEMENT,
} from 'modules/element/elements.js';
import { useCreateElement } from '../../../graphql/Element/hooks';
import math from 'math.js';
import { useModalElementCommands } from '@/graphql/Modal/hooks';

export const NameElementModal = () => {
	const { modal } = useReactiveVar(getEditPopup);
	const { showAddElementModal, newElement } = useReactiveVar(getAddModalElement);
	const { createModalElement, createLoading } = useModalElementCommands();

	const [createElement, { loading }] =  useCreateElement(
		newElement.type
	);
	const { name, type } = newElement;

	const close = () => {
		setAddModalElement({
			...ADD_MODAL_ELEMENT_VAR_INITIAL_DATA,
			showAddElementModal: false,
		});
	};
	const handleCreate = async () => {
		// First we create an element, this is because modal elements and interaction
		// elements are the same as this level. Once the element is created we pass that
		// to the onSelect function that with either create a interaction or modal element
		// parent as needed
		const { type, src, html, posObject, name } = newElement;

		if (type === 'App\\ImageElement' && !src) {
			return errorAlert({
				title: 'Error creating image element',
				text: 'Please select an image you want to upload. If the problem persits please contact support',
			});
		}

		try {
			const element = {
				name,
				posX: math.round(posObject.x, 4),
				posY: math.round(posObject.y, 4),
			};

			if (src) element.src = src;

			if (html) element.html = html;
			
			const request = await createElement(element);

			let result = request.data.result;
			result.id = Number(result.id);
			
			await addModalElement(result.id, type);
			close();
		} catch (e) {
			console.log(e);
			errorAlert({
				title: 'Error creating element',
				text: 'We were unable to create the new element, please try again. If the problem persits please contact support',
			});
		}
	};

	const addModalElement = async (elementId, elementType) => {
		try {
			const req = await createModalElement({
				variables: {
					input: {
						element_type: elementType,
						element_id: elementId,
						modal_id: parseInt(modal.id),
					},
				},
			});

		} catch (err) {
			console.error(err);
			errorAlert({ text: 'Unable to add element' });
		}
	};	

	const handleNext = () => {
		setAddModalElement({
			showAddElementModal: false,
		});
	};

	return (
		<Modal
			height={250}
			width={500}
			show={showAddElementModal}
			onClose={close}
			onBack={close}
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
						loading={loading || createLoading}
						icon='plus'
						primary
						onClick={handleCreate}
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
						: handleCreate
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