import React, { useEffect, useRef, useContext } from 'react';
import anime from 'animejs';
import forEach from 'lodash/forEach';
import { useParams } from 'react-router-dom';
import { Icon } from 'components';
import { Grid } from 'modules/node/components/NodeCanvas';
import ModalTimer from 'modules/interaction/components/ModalTimer';
import { PreviewContext } from './ModalCanvas';
import styles from './ModalPage.module.scss';

const ModalBackground = ({ modal, children }) => {
	const canPreview = useContext(PreviewContext);
	const refContainer = useRef(null);
	const refCloseIcon = useRef(null);
	const { modalId } = useParams();

	const { border_radius, backgroundColour, show_close_icon, close_icon_color, background_animation, size } = modal;

	const closeIconStyle = {
		color: close_icon_color,
	};
	// Custom Modal styles
	let padding = (100 - size) / 2 + '%';
	const modalPosition = {
		top: padding,
		bottom: padding,
		left: padding,
		right: padding,
	};
	const modalStyles = {
		top: 0,
		bottom: 0,
		left: 0,
		right: 0,
		borderRadius: border_radius + 'px',
		backgroundColor: backgroundColour ? backgroundColour : 'white',
		position: 'absolute',
		zIndex: 20,
	};
	
	useEffect(() => {
		const animCloseIcon = {
			delay: 1,
			duration: 1,
			easing: "linear",
			name: "FadeIn",
			playSound: true,
			timer_duration: 10,
			use_timer: true
		}
		window.addEventListener('preview_animation', (e) => {
			if (e.detail === 'Modal:' + modal.id && canPreview) {
				preview(refContainer, modalStyles, background_animation);
				preview(refCloseIcon, closeIconStyle, animCloseIcon);
			}
		});
		return () => {
			window.removeEventListener('preview_animation', () => {
				preview(refContainer, modalStyles, background_animation);
				preview(refCloseIcon, closeIconStyle, animCloseIcon);
			});
		};
	}, [border_radius, backgroundColour, background_animation, size]);

	const handleCloseModal = (e) => {
		console.log('TIGER', canPreview);
	}

	return (
		<>
			<div 
				style={{
					...modalPosition,
					borderRadius: border_radius + 'px',
					position: 'absolute',
					zIndex: 10,
					overflow: 'hidden'
				}}
			>
				<div style={modalStyles} ref={refContainer} />
			</div>
			<div
				style={{
					...modalPosition,
					position: 'absolute',
					zIndex: 20,
				}}
			>
				{
					background_animation && background_animation?.use_timer  
					? <ModalTimer modal={modal} canPreview={canPreview} /> 
					: null
				}
				{show_close_icon ? (
					<div 
						ref={refCloseIcon}
						className={styles.modalClose} 
						style={closeIconStyle}
						onClick={handleCloseModal}
					>
						<Icon name='times' />
					</div>
				) : null}
				{children}
			</div>
			<div
				style={{
					top: 0,
					bottom: 0,
					left: 0,
					right: 0,
					position: 'absolute',
					zIndex: 10,
					overflow:'hidden'
				}}
			>
				{modalId === modal.id && <Grid />}
			</div>
		</>
	);
};
export default ModalBackground;

const animate = (refContainer, animation) => {
	if (animation) {
		const a = window.background_animations[animation.name];
		const animationObj = a
			? a.anime
			: window.background_animations['FadeIn'].anime;
		const basicTimeline = anime.timeline();

		const { delay, easing, duration } = animation;
		const obj = {
			targets: refContainer.current,
			...animationObj,
			delay: delay ? delay * 1000 : 0,
			easing,
			duration: duration * 1000,
		};
		basicTimeline.add(obj);
	}
};

const preview = (refContainer, style, animation) => {
	if (!refContainer.current) return null;

	refContainer.current.removeAttribute('style');
	forEach(style, (value, key) => {
		if (key === 'borderRadius' && !value.includes('px')) {
			refContainer.current.style.borderRadius = value + 'px';
		} else if (key === 'letterSpacing' && !value.includes('px')) {
			refContainer.current.style.letterSpacing = value + 'px';
		} else {
			refContainer.current.style[key] = value;
		}
	});

	animate(refContainer, animation);
};
