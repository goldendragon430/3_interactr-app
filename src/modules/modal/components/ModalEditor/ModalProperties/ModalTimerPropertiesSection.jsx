import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import {
	animationState,
	preAnimationState,
	transition,
} from 'components/PageBody';
import {
	BooleanInput,
	SelectInput,
	Section,
	Option,
	RangeInput,
} from 'components/PropertyEditor';
import { ActionArgsSwitch } from 'modules/element/components/Properties/ClickableElementProperties';
import { useModalCommands } from '@/graphql/Modal/hooks';
import Icon from "components/Icon";
import { useQuery } from '@apollo/client';
import { GET_MODAL } from '@/graphql/Modal/queries';
import {useParams} from 'react-router-dom'
import { getEditPopup } from '@/graphql/LocalState/editPopup';
import { useReactiveVar } from '@apollo/client';

export const ModalTimerPropertiesSection = () => {
	const { modal } = useReactiveVar(getEditPopup);

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

	// gotta handle it not being set , like in a blank modal etc...
	const { background_animation } = data.result;

	const { use_timer, timer_duration, playSound, endAction, endActionArg } =
		background_animation;

	const changeHandler = (key, value) => {
		const fields = typeof key === 'object' ? key : { [key]: value };
		
		fields.timer_duration || timer_duration
			? (fields.use_timer = true)
			: (fields.use_timer = false);

		if(key == "use_timer") {
			fields.timer_duration = ( value ? fields.timer_duration : 0)
		}

		// setEditPopup({
		// 	modal: {
		// 		background_animation: {
		// 			...background_animation,
		// 			...fields,
		// 		},
		// 	},
		// });

		updateModal('background_animation', {
			...background_animation,
			...fields,
		});
	};

	const options = {
		'': 'Do nothing',
		playNode: 'Play Node',
		closeModal: 'Close Popup',
	};

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
						label='Timer Duration'
						value={timer_duration}
						Component={RangeInput}
						min={0}
						max={20}
						step={1}
						onChange={(val) => changeHandler('timer_duration', val)}
					/>
					{timer_duration ? (
						<AnimatePresence>
							<motion.div
								exit={preAnimationState}
								initial={preAnimationState}
								animate={animationState}
								transition={transition}
							>
								<>
									<Option
										label='Show Timer Animation'
										value={use_timer}
										Component={BooleanInput}
										onChange={(val) => changeHandler('use_timer', val)}
									/>
									<Option
										label='Play Timer Sound'
										value={playSound}
										Component={BooleanInput}
										onChange={(val) => changeHandler('playSound', val)}
									/>
									<Option
										label={'Action to take when timer expires'}
										value={endAction}
										onChange={(val) => {
											changeHandler({
												endAction: val,
												endActionArg: '',
											});
										}}
										Component={SelectInput}
										options={options}
									/>
									<div style={{ height: '400px' }}>
										<ActionArgsSwitch
											update={changeHandler}
											save={changeHandler}
											element={{ action: endAction, endActionArg }}
											label={'endActionArg'}
										/>
									</div>
								</>
							</motion.div>
						</AnimatePresence>
					) : null}
				</Section>
			</motion.div>
		</AnimatePresence>
	);
};
