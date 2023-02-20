import React, { useContext, useEffect, useRef } from 'react';
import { useQuery } from '@apollo/client';
import anime from 'animejs';
import gql from 'graphql-tag';
import forEach from 'lodash/forEach';

import { useKeyPress } from 'utils/hooks';
import { PreviewContext } from 'modules/modal/components/ModalCanvas';

/**
 * Render the element on the node canvas
 * @param children
 * @param style
 * @param interaction_id
 * @returns {null|*}
 * @constructor
 */
const PLAYER_QUERY = gql`
	query player {
		player @client {
			clickThruMode
		}
	}
`;
const Element = ({
	children,
	style,
	animation,
	selected,
	onSelect,
	onDelete,
	id,
	element,
	animationKey,
	editing,
	preview,
	vResizeDisabled=false
}) => {
	const refContainer = useRef(null);
	const deleteKeyPressed = useKeyPress('Delete');
	const backspaceKeyPressed = useKeyPress('Backspace');
	
	// IF delete key pressed for the active item we can call the delete func if present
	if (!vResizeDisabled && !preview && !editing && ((deleteKeyPressed || backspaceKeyPressed) && selected && onDelete)) {
		onDelete();
	}

	return (
		<AnimatedElement
			id={id}
			refContainer={refContainer}
			style={style}
			selected={selected}
			animation={animation}
			onSelect={onSelect}
			element={element}
			animationKey={animationKey}
		>
			{children}
		</AnimatedElement>
	);
};
export default Element;

const animate = (refContainer, animation) => {
	const basicTimeline = anime.timeline();
	if (animation) {
		const a = window.element_animations[animation?.name];
		const animationObj = a
			? a.anime
			: window.element_animations['FadeIn'].anime;

		const { delay, easing, duration } = animation;
		const obj = {
			targets: refContainer.current,
			...animationObj,
			delay: delay ? delay * 1000 : 0,
			easing,
			duration: duration ? duration * 1000 : 1000,
		};
		basicTimeline.add(obj);
	} else {
		const obj = {
			targets: refContainer.current,
			...window.element_animations['FadeIn'].anime,
			delay: 0,
			easing: 'easeInExpo',
			duration: 1000,
		};
		basicTimeline.add(obj);
	}
};

const preview = (refContainer, style, animation) => {
	if (!refContainer.current) return null;

	refContainer.current.removeAttribute('style');
	forEach(style, (value, key) => {
		if (key === 'borderRadius' && !value.toString().includes('px')) {
			refContainer.current.style.borderRadius = value + 'px';
		} else if (key === 'letterSpacing' && !value.toString().includes('px')) {
			refContainer.current.style.letterSpacing = value + 'px';
		} else {
			refContainer.current.style[key] = value;
		}
	});

	animate(refContainer, animation);
};

const AnimatedElement = ({
	refContainer,
	animation,
	children,
	style,
	selected,
	onSelect,
	id,
	element,
	animationKey,
}) => {
	const { data, loading, error } = useQuery(PLAYER_QUERY);
	const canPreview = useContext(PreviewContext);

	useEffect(() => {
		window.addEventListener('preview_animation', (e) => {
			if (e.detail === animationKey) {
				preview(refContainer, style, animation);
			}
		});
		return () => {
			window.removeEventListener('preview_animation', () =>
				preview(refContainer, style, animation)
			);
		};
	}, [animation, element]);

	if (loading || error) return null;

	if (data.player.clickThruMode) {
		style.cursor = 'pointer';
	}

	const clickHandler = () => {
		if (!data.player.clickThruMode) {
			onSelect();
		}
	};

	return (
		<div
			ref={refContainer}
			data-elemkey={id && id.toString()}
			onClick={clickHandler}
			style={{
				...style,
				outline: selected && '2px dashed rgba(17, 51, 72,0.8)',
				willChange: 'transform',
				//boxShadow: selected && '0 0 5px 0 #fff'
			}}
		>
			{children}
		</div>
	);
};
