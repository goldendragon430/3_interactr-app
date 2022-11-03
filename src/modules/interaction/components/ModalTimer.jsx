import React from 'react';
import anime from 'animejs';
import styles from './ModalTimer.module.scss';

import { CountdownCircleTimer } from 'react-countdown-circle-timer';

export default class ModalTimer extends React.Component {
	wrapper = React.createRef();
	baseLeft = React.createRef();
	baseRight = React.createRef();

	constructor(props) {
		super(props);

		this.state = {
			startTimer: false,
			time: 0,
			interval: false,
		};
	}

	componentDidMount() {
		this.animate();
		const { modal } = this.props;
		window.addEventListener('preview_animation', (e) => {
			if (e.detail === 'Modal:' + modal.id && this.props.canPreview) {
				this.animate();
			}
		});
	}

	componentDidUpdate() {
		//    this.animate();
	}

	animate() {
		const { modal } = this.props;
		const { startTimer } = this.state;

		this.setState({
			time: modal.background_animation.timer_duration,
		});

		// Can be not set yet
		if (modal && modal.background_animation) {
			const animation = modal.background_animation;
			// const animationObj =
			// 	window.background_animations[modal.background_animation.name].anime;
			const basicTimeline = anime.timeline();

			const obj = {
				targets: this.wrapper.current,
				opacity: [0, 1],
				easing: 'linear',
				delay: animation.duration * 1000,
				duration: 1000,
			};

			basicTimeline.add(obj);

			// if(! startTimer){
			//     setTimeout(()=>{
			//
			//         this.setState({startTimer: true})
			//
			//         const interval = setInterval(()=>{
			//
			//             if(this.state.time === 0) {
			//                 clearInterval(this.state.interval);
			//                 this.setState({startTimer: false})
			//             }
			//
			//             this.setState({
			//                 time: (this.state.time > 0) ? this.state.time - 1 : 0
			//             });
			//
			//         }, 1000);
			//
			//         this.setState({interval});
			//
			//     }, animation.duration * 1000);
			// }
		}
	}

	componentWillUnmount() {
		clearInterval(this.state.interval);
	}

	render() {
		const { modal } = this.props;
		const { startTimer, time } = this.state;

		return (
			<div ref={this.wrapper} className={styles.wrapper}>
				<CountdownCircleTimer
					isPlaying={false}
					durationSeconds={modal.background_animation.timer_duration}
					colors={[['#fff']]}
					trailColor={'transparent'}
					size={50}
					strokeWidth={5}
				/>
				{time > 0 && <p className={styles.indicator}>{time}</p>}
			</div>
		);
	}
}
