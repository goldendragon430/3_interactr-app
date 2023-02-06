import React from 'react';
import gql from 'graphql-tag';
import math from 'math.js';
import { useQuery } from '@apollo/client';
import { useReactiveVar } from '@apollo/client';
import { useParams } from 'react-router-dom';
import { errorAlert } from '../../../utils/alert';
import { useElementRoute } from '../../element/routeHooks';
import {
	getAddModalElement,
	setAddModalElement,
	ADD_MODAL_ELEMENT_VAR_INITIAL_DATA
} from '@/graphql/LocalState/addModalElement';
import AddImageFromComputerModal from '../../interaction/components/AddImageFromComputerModal';
import SelectImageElementTypeModal from '../../interaction/components/SelectImageElementTypeModal';
import AddFromImageLibraryModal from '../../interaction/components/AddFromImageLibraryModal';
import AddHtmlElementModal from '../../interaction/components/AddHtmlElementModal';
import { useCreateElement } from '../../../graphql/Element/hooks';
import { useModalElementCommands } from '@/graphql/Modal/hooks';
import { NameElementModal } from './NameElementModal';
import { getEditPopup } from '@/graphql/LocalState/editPopup';

const SelectPopupModal = () => {
	const {
		showAddFromImageLibraryModal,
		showAddImageFromComputerModal,
		showAddHtmlElementModal,
		showSelectImageElementTypeModal,
		newElement
	} = useReactiveVar(getAddModalElement);
	

	const { modal } = useReactiveVar(getEditPopup);
	const { createModalElement, createLoading } = useModalElementCommands();
	
	const [createElement, { loading }] =  useCreateElement(
		newElement.type
	);
	const { name, type } = newElement;

	const onClose = () => {
		setAddModalElement({
			...ADD_MODAL_ELEMENT_VAR_INITIAL_DATA,
			// showSelectImageElementTypeModal: false,
			// showAddFromImageLibraryModal: false,
			// showAddImageFromComputerModal: false,
			// showAddHtmlElementModal: false,
			// showAddElementModal: false,
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
			onClose();
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

	const handleSelectImageElementTypeModalBack = () => setAddModalElement({
		showSelectElementGroupModal: true,
		showSelectImageElementTypeModal: false
	});

	const setTypeFromLibrary = () => setAddModalElement({
		showSelectImageElementTypeModal: false,
		showAddFromImageLibraryModal: true,
	});

	const setTypeFromComputer = () => setAddModalElement({
		// ...ADD_INTERACTION_VAR_INITIAL_DATA,
		showSelectImageElementTypeModal: false,
		showAddImageFromComputerModal: true,
	})

	const handleAddFromImageLibraryModalSubmit = (options) => {
    const { src, width, height } = options;
    setAddModalElement({
      newElement: {
        ...newElement,
        src,
        height,
        width
      }
    });
  }

	const handleAddFromImageLibraryModalBack = () => setAddModalElement({
		showAddFromImageLibraryModal: false,
		showSelectImageElementTypeModal: true
	});

	const handleAddImageFromComputerModalBack = () => setAddModalElement({
		showAddImageFromComputerModal: false,
		showSelectImageElementTypeModal: true
	});

	const handleDropzoneUploadSuccess = ({src}) => {
		setAddModalElement({
			newElement: {
				...newElement,
				src,
			}
		});
	};

	const handleAddHtmlElementModalBack = () => setAddModalElement({
		showAddHtmlElementModal: false,
		showSelectElementGroupModal: true,
	});

	const handleAddHtmlElementModalChange = val => setAddModalElement({
		newElement: {
			...newElement,
			html: val
		}
	});

	return (
		<>
			<NameElementModal
				onCreate={handleCreate}
				onClose={onClose}
				loading={loading | createLoading}
			/>
			<SelectImageElementTypeModal 
				close={onClose}
				show={showSelectImageElementTypeModal}
				onBack={handleSelectImageElementTypeModalBack} 
				setTypeFromLibrary={setTypeFromLibrary}
				setTypeFromComputer={setTypeFromComputer}
			/>

			<AddFromImageLibraryModal 
				close={onClose} 
				handleCreate={handleCreate} 
				newElement={newElement} 
				show={showAddFromImageLibraryModal} 
				handleSubmit={handleAddFromImageLibraryModalSubmit}
				onBack={handleAddFromImageLibraryModalBack}
			/>

			<AddImageFromComputerModal
				close={onClose}
				handleCreate={handleCreate}
				loading={loading | createLoading}
				newElement={newElement}
				show={showAddImageFromComputerModal}
				onBack={handleAddImageFromComputerModalBack}
				onSuccess={handleDropzoneUploadSuccess}
			/>

			<AddHtmlElementModal
				close={onClose}
				handleCreate={handleCreate}
				loading={loading | createLoading}
				newElement={newElement}
				show={showAddHtmlElementModal}
				onBack={handleAddHtmlElementModalBack}
				onChange={handleAddHtmlElementModalChange}
			/>
		</>
	);
};

export default SelectPopupModal;
