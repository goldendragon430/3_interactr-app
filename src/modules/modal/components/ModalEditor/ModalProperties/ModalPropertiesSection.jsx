import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useReactiveVar } from '@apollo/client';
import {useParams} from 'react-router-dom'

import {
	animationState,
	preAnimationState,
	transition,
} from 'components/PageBody';
import {
	Section,
	Option,
	TextInput,
	ColorInput,
	RangeInput,
} from 'components/PropertyEditor';
import Icon from "components/Icon";
import { useQuery } from '@apollo/client';
import { GET_MODAL } from '@/graphql/Modal/queries';
import { useModalCommands } from '@/graphql/Modal/hooks';
import {SAVE_MODAL_PAGE} from "../../../../../utils/EventEmitter";
import { getEditPopup } from '@/graphql/LocalState/editPopup';

export const ModalPropertiesSection = () => {
	const { modal } = useReactiveVar(getEditPopup);

	// const updateModal = (key, val) => {
	// 	setEditPopup({
	// 		modal: {
	// 			[key]: val,
	// 		},
	// 	});
	// };

	// if (!modal) return null;

	let { modalId } = useParams();

	if(!modalId && modal) {
		modalId = modal.id;
	}

	const { updateModal } = useModalCommands(modalId);

	const { loading, error, data} = useQuery(GET_MODAL, {
		variables: {
			id: modalId
		},
	});

	if(error) return null;
	if(loading) return <Icon loading />;

	const handleUpdateModal = (key, value) => {
		updateModal(key, value);
		// var event = new CustomEvent(SAVE_MODAL_PAGE);
    // window.dispatchEvent(event);
	}
	const { name, size, border_radius, backgroundColour } = data.result;

	return (
		<AnimatePresence>
			<motion.div
				exit={preAnimationState}
				initial={preAnimationState}
				animate={animationState}
				transition={transition}
			>
				<Section>
					<Option
						label='Name'
						value={name}
						Component={TextInput}
						onChange={(val) => handleUpdateModal('name', val)}
					/>
					{/* Properties that apply to both end cards and popups go here */}
					<div style={{ position: 'relative', zIndex: 200 }}>
						<Option
							label='Background Color'
							value={backgroundColour == '' ? 'rgba(255, 255, 255, 1)' : backgroundColour}
							Component={ColorInput}
							onChange={(val) => handleUpdateModal('backgroundColour', val)}
						/>
					</div>
					<Option
						label='Size (%)'
						value={size}
						Component={RangeInput}
						onChange={(val) => handleUpdateModal('size', val)}
					/>
					<Option
						label='Roundness (px)'
						value={border_radius}
						Component={RangeInput}
						onChange={(val) => handleUpdateModal('border_radius', val)}
					/>
				</Section>
			</motion.div>
		</AnimatePresence>
	);
};
