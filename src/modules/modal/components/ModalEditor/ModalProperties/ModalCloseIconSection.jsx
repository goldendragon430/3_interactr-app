import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useReactiveVar } from '@apollo/client';

import {
	animationState,
	preAnimationState,
	transition,
} from 'components/PageBody';
import {
	BooleanInput,
	Section,
	Option,
	ColorInput,
} from 'components/PropertyEditor';
import { useModalCommands } from '@/graphql/Modal/hooks';
import Icon from "components/Icon";
import { useQuery } from '@apollo/client';
import { GET_MODAL } from '@/graphql/Modal/queries';
import {useParams} from 'react-router-dom'
import { getEditPopup } from '@/graphql/LocalState/editPopup';


export const ModalCloseIconSection = () => {
	const { modal } = useReactiveVar(getEditPopup);

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

	// const updateModal = (key, val) => {
	// 	setEditPopup({
	// 		modal: {
	// 			[key]: val,
	// 		},
	// 	});
	// };
	// if (!modal) return null;

	const { show_close_icon, close_icon_color } = data.result;

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
						label='Show Close Icon'
						value={show_close_icon}
						Component={BooleanInput}
						onChange={(val) => updateModal('show_close_icon', val)}
					/>
					{!!show_close_icon && (
						<AnimatePresence>
							<motion.div
								exit={preAnimationState}
								initial={preAnimationState}
								animate={animationState}
								transition={transition}
							>
								<div style={{ position: 'relative', zIndex: 100 }}>
									<Option
										label='Close Icon Color'
										value={close_icon_color}
										Component={ColorInput}
										onChange={(val) => updateModal('close_icon_color', val)}
									/>
								</div>
							</motion.div>
						</AnimatePresence>
					)}
				</Section>
			</motion.div>
		</AnimatePresence>
	);
};
