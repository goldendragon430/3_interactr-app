import React from 'react';
import PropTypes from 'prop-types';
import { useReactiveVar } from '@apollo/client';

import { Icon, Modal } from 'components';
import { Button } from 'components/Buttons';
import { Option, TextInput } from 'components/PropertyEditor';
import {
	getAddInteraction,
	setAddInteraction,
} from '@/graphql/LocalState/addInteraction';
import {
	IMAGE_ELEMENT,
	CUSTOM_HTML_ELEMENT,
} from 'modules/element/elements.js';
import { SelectElementGroup } from './SelectElementGroup';

export const SelectElementGroupModal = ({ close, handleCreate, loading }) => {
	const { showSelectElementGroupModal, newElement } = useReactiveVar(getAddInteraction);

	const { name, type, element_group_id } = newElement;

	const handleNext = () => {
		setAddInteraction({
			showSelectElementGroupModal: false,
			showSelectImageElementTypeModal: type === IMAGE_ELEMENT ? true : false,
			showAddFromImageLibraryModal: false,
			showAddImageFromComputerModal: false,
			showAddHtmlElementModal: type === CUSTOM_HTML_ELEMENT ? true : false,
			showAddElementModal: type !== CUSTOM_HTML_ELEMENT && type !== IMAGE_ELEMENT ? true : false,
		});
	};

	return (
		<Modal
			height={430}
			width={500}
			show={showSelectElementGroupModal}
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
						loading={loading}
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
					setAddInteraction({
						newElement: {
							...newElement,
							name: val,
						},
					})
				}
			/>
			{
				<>
					<label>Would you like to add this element to a group?</label>
					<SelectElementGroup
						value={element_group_id}
						onEnter={
							type === CUSTOM_HTML_ELEMENT || type === IMAGE_ELEMENT
								? handleNext
								: handleCreate
						}
						onChange={(val) =>
							setAddInteraction({
								newElement: {
									...newElement,
									element_group_id: val,
								},
							})
						}
					/>
					<p>
						<small>
							Element groups all share the same show and hide time so if you
							have several elements that you want to appear at the same time
							it's best to add them to a group.
						</small>
					</p>
				</>
			}
		</Modal>
	);
};

SelectElementGroupModal.propTypes = {
	close: PropTypes.func.isRequired,
	handleCreate: PropTypes.func.isRequired,
	loading: PropTypes.bool.isRequired,
};
