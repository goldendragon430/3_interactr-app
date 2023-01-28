import React, { useEffect, useState, useRef } from 'react';
import anime from 'animejs';
import styles from './ModalTimer.module.scss';
import { CountdownCircleTimer } from 'react-countdown-circle-timer';

const ModalTimer = ({ modal, canPreview }) => {
	const wrapper = useRef();
	const [key, setKey] = useState(0);
	const [playing, setPlaying] = useState(false);
	
	useEffect(() => {
		const animation = modal.background_animation;
		
		const anim = anime({
			targets: wrapper.current,
			opacity: [0, 1],
			easing: 'linear',
			delay: animation.duration * 2000,
			duration: 1000,
			autoplay: false,
			complete: function(anim) {
				setPlaying(true);
			}
		});
		anim.seek(animation.duration * 2000 + 999);

		const listener = (e) => {
			if (e.detail === 'Modal:' + modal.id && canPreview && wrapper.current) {
				setKey(prevKey => prevKey + 1);
				setPlaying(false);
				anim.restart();
			}
		}

		window.addEventListener('preview_animation', listener);
		return () =>  {
			window.removeEventListener('preview_animation', listener);
			anim.remove(wrapper.current);
		}
	}, []);

	return (
		<div ref={wrapper} className={styles.wrapper}>
			<CountdownCircleTimer
			 	key={key}
				isPlaying={playing}
				duration={modal.background_animation.timer_duration}
				initialRemainingTime={modal.background_animation.timer_duration}
				colors={['#fff']}
				trailColor="#111"
				size={50}
				strokeWidth={5}
				trailStrokeWidth={5}
				strokeLinecap="butt"
				onComplete={() => {
					setPlaying(false);
					return { shouldRepeat: true, newInitialRemainingTime: modal.background_animation.timer_duration}
				}}
			>
				{({ remainingTime }) => remainingTime}
			</CountdownCircleTimer>
		</div>
	)
}

export default ModalTimer;