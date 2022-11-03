import React from 'react';
import PropTypes from 'prop-types';
import { createPortal } from 'react-dom';
import { DraggableCore } from 'react-draggable';
import callsProp from 'decorators/callsProp';

const initialState = {
	dragging: false,
};

export default class CloneOnDrag extends React.Component {
	state = initialState;

	static defaultProps = {
		offset: {
			x: 50,
			y: 0,
		},
	};

	constructor(props) {
		super(...arguments);
		this.state = this.getInitialState(props);
		this.el = document.createElement('div');
	}

	getInitialState(props) {
		const { offset } = props;
		return {
			...initialState,
			...offset,
		};
	}

	resetState() {
		this.setState(this.getInitialState(this.props));
	}

	@callsProp('onStart')
	handleDragStart(e) {
		e.preventDefault();
		// e.dataTransfer.dropEffect = 'copy';
		this.setState({ dragging: true });
	}

	@callsProp('onDrag')
	handleDrag(e, { x, y }) {
		const { offset, onDragging } = this.props;
		// this.setState(({x, y}) => ({x: x + deltaX, y: y + deltaY}));
		this.setState({ x: x + offset.x, y: y + offset.y });
		onDragging && onDragging(true);
	}

	@callsProp('onStop')
	handleDragStop() {
		const { onDragging } = this.props;
		this.resetState();
		onDragging && onDragging(false);
	}

	componentDidMount() {
		document.body.appendChild(this.el);
	}

	componentWillUnmount() {
		document.body.removeChild(this.el);
	}

	render() {
		const { children, className, dragElement } = this.props;
		const { dragging, x, y } = this.state;

		return (
			<DraggableCore
				onStart={this.handleDragStart}
				onDrag={this.handleDrag}
				onStop={this.handleDragStop}
				offsetParent={document.body}
			>
				<div style={{ position: 'relative' }} className={className}>
					{children}
					{dragging &&
						createPortal(
							<div
								style={{ position: 'absolute', left: x, top: y, zIndex: 80000 }}
							>
								<div style={{ maxWidth: 1, left: '50%', position: 'absolute' }}>
									{dragElement || children}
								</div>
							</div>,
							this.el
						)}
				</div>
			</DraggableCore>
		);
	}
}

CloneOnDrag.propTypes = {
	offset: PropTypes.object.isRequired,
	onDragging: PropTypes.func,
	children: PropTypes.element.isRequired,
	dragElement: PropTypes.object.isRequired,
	className: PropTypes.string,
};