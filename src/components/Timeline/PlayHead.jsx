import React, {Component} from 'react';
import Draggable, {DraggableCore} from 'react-draggable';
import styles from './PlayHead.module.scss';
import Emitter, {VIDEO_SCRUB} from "../../utils/EventEmitter";

const initialState = {x: null};
export default class PlayHead extends Component {
  state = initialState;

  handleStartDrag = () => {
    this.setState({dragging: true});
    // this.props.pause();
  };

  handleDrag = (e, {deltaX}) => {
    const newX = this.getX() + deltaX;
    this.setState({x: newX});

    // comment out to only update on end drag
    this.props.onChange(newX);
  };

  handleStopDrag = (...args) => {
    this.setState({dragging: false});

    // enable this to only update on end drag
    // this.props.onChange(this.state.x);
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.x !== this.props.x && !this.state.dragging) {
      this.setState(initialState);
    }
  }

  getX() {
    const x = this.state.x || this.props.x;

    const timelineHolder = document.getElementById("axis-wrapper");
    if (x < 1) return 0;
    if (x > timelineHolder.offsetWidth) {
      return timelineHolder.offsetWidth;
    }
    return x;
  }

  render() {
    return (
      <DraggableCore
        axis="x"
        bounds="parent"
        onDrag={this.handleDrag}
        onStart={this.handleStartDrag}
        onStop={this.handleStopDrag}
      >
        <div className={styles.PlayHead} style={{left: this.getX()}}>
          <div className={styles.handle} />
        </div>
      </DraggableCore>
    );
  }
}
