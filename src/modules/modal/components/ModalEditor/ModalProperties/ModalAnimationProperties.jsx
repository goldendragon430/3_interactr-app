import React from 'react';
import _map from 'lodash/map';

import { SelectInput, Option, RangeInput } from 'components/PropertyEditor';
import { easings } from 'utils/animations';
import { useModalCommands } from '@/graphql/Modal/hooks';
import {SAVE_MODAL_PAGE} from "../../../../../utils/EventEmitter";
import Icon from "components/Icon";
import { useQuery } from '@apollo/client';
import { GET_MODAL } from '@/graphql/Modal/queries';
import {useParams} from 'react-router-dom'
import { getEditPopup } from '@/graphql/LocalState/editPopup';
import { useReactiveVar } from '@apollo/client';

export const ModalAnimationProperties = () => {
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

	const changeHandler = (key, value) => {
		console.log(key, value);
		// setEditPopup({
		// 	modal: {
		// 		background_animation: {
		// 			...background_animation,
		// 			...{ [key]: value },
		// 		},
		// 	},
		// });
		updateModal('background_animation', {
			...background_animation,
			...{ [key]: value },
		});
	};

	return (
		<>
			<Option
				label='Background Animation'
				name='background-animation-select'
				value={background_animation.name}
				options={_map(window.background_animations, (b, i) => ({
					label: b.label,
					value: i,
				}))}
				Component={SelectInput}
				onChange={(val) => changeHandler('name', val)}
			/>
			<Option
				label='Animation Easing'
				name='background-easing-select'
				value={background_animation.easing}
				options={easings}
				Component={SelectInput}
				onChange={(val) => changeHandler('easing', val)}
			/>
			<Option
				label='Animation Duration'
				value={background_animation.duration}
				Component={RangeInput}
				onChange={(val) => changeHandler('duration', val)}
				min={0.1}
				max={3.0}
				step={0.1}
			/>
		</>
	);
};
