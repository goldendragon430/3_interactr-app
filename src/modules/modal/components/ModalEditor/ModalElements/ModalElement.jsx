import React from 'react';
import PropTypes from 'prop-types';

import { useModalElementRoute } from 'modules/modal/routeHooks';
import { useModalElementCommands } from '@/graphql/Modal/hooks';
import { ElementListItem } from 'modules/element/components/ElementListItem';

export const ModalElement = ({ modalElement, index }) => {
	const [, setModalElementId] = useModalElementRoute();
	const { deleteModalElement, copyModalElement } = useModalElementCommands();
	
	const onDelete = () =>
		deleteModalElement({
			variables: {
				id: modalElement.id,
			},
		});

	const onCopy = () =>
		copyModalElement({
			variables: {
				input: {
					id: parseInt(modalElement.id),
				},
			},
		});

	return (
		<ElementListItem
			index={index}
			element={modalElement.element}
			onSelect={() => setModalElementId(modalElement.id)}
			onDelete={onDelete}
			onCopy={onCopy}
		/>
	);
};

ModalElement.propTypes = {
	modalElement: PropTypes.object.isRequired,
	index: PropTypes.number.isRequired,
};
