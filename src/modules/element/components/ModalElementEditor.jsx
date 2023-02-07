import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Swal from 'sweetalert2';
import uniqueId from 'lodash/uniqueId';
import { useReactiveVar } from '@apollo/client';

import ElementContainer from './Element/ElementContainer';
import { useModalElementRoute, useModalRoute } from 'modules/modal/routeHooks';
import { useModalElementCommands } from '@/graphql/Modal/hooks';
import { getEditPopup } from '@/graphql/LocalState/editPopup';

/**
 * Props needed for this component
 * @type {{interaction: *}}
 * @private
 */
const _props = {
	// The parent modal element
	modalElement: PropTypes.object.isRequired,
	preview: PropTypes.bool,
};

/**
 * Wraps the Element container for the ModalElements. This component provides
 * the context for the child element to access the click and delete actions and
 * also the isActive check. For modalElements not Interaction Elements
 * @param modalElement
 * @param preview
 * @returns {*}
 * @constructor
 */
const ModalElementEditor = ({ modalElement, preview }) => {
	const [activeModalElement, setActiveModalElement, back] = useModalElementRoute();
	//const [activeModalElement, setActiveModalElement] = useState();

	const { goToModalPage } = useModalRoute();

	// Save unique key as we're rendering a list item
	const [key] = useState(uniqueId());

	const { deleteModalElement } = useModalElementCommands();

	const handleDelete = () => {
		Swal.fire({
			title: 'Are you sure? ',
			text: 'Are you sure you want to delete this element',
			icon: 'warning',
			showCloseButton: true,
			showCancelButton: true,
			confirmButtonColor: '#ff6961',
			confirmButtonText: 'Delete',
		}).then((result) => {
			if(result.isConfirmed) {
				deleteModalElement({
					variables: {
						id: modalElement.id,
					},
				});
				// goToModalPage(modal.id);
				back();
			}
		});
	};

	const { element_type } = modalElement;
	
	return (
		<ElementContainer
			key={key}
			element={modalElement.element}
			element_type={element_type}
			onSelect={() => setActiveModalElement(modalElement.id)}
			selected={activeModalElement === modalElement.id}
			onDelete={handleDelete}
			// This is used so when we fire the global animation event the
			// right elements actually animate
			animationKey={'Modal:' + modalElement.modal_id}
			preview={preview}
		/>
	);
};
ModalElementEditor.propTypes = _props;
export default ModalElementEditor;
