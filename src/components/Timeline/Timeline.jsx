import React, {Component} from 'react';
import times from 'lodash/times';
import styles from './Timeline.module.scss';
import Time from 'components/Time';
import PlayHead from './PlayHead';
import IconButton from 'components/Buttons/IconButton';
import Icon from 'components/Icon'
import {BooleanInput, Option} from "../PropertyEditor";
import cx from 'classnames';
import Emitter, {VIDEO_SCRUB} from "../../utils/EventEmitter";
import {usePlayer} from "../../graphql/LocalState/player";
import gql from "graphql-tag";
import {useQuery} from "@apollo/client";

const PLAYER_QUERY = gql`
    query player {
        player @client {
            duration
            playedSeconds
        }
    }
`;
const Timeline = ({children}) => {
  const {data, loading, error} = useQuery(PLAYER_QUERY);

  const {updatePlayer} = usePlayer();

  if(loading || error) return null;

  const {playedSeconds, duration} = data.player;

  // x position relative to Timeline root el
  // Our media lib can handle seeking by percentage
  const handleScrub = newX => {
      const timelineHolder = document.getElementById("axis-wrapper");

      // If the newX is the same as the width of the parent the playhead is at the
      // end so set the pos to the duration of the video so users can easily move
      // the playhead to the end
      let percentage = (newX >=  timelineHolder.offsetWidth) ? 100 : newX / timelineHolder.offsetWidth;

      // Prevent any - playhead numbers.
      if(percentage < 0) percentage = 0;

    // On scrub we want to show the new playedSeconds straight away rather
    // than when the video finally loads at the new time.
    percentage = Math.min(percentage, 1);

    const playedSeconds = Math.max(duration * percentage, 0);
    updatePlayer("playedSeconds", playedSeconds);

    // Fire event to the player to move the video to the current played seconds
    Emitter.emit(VIDEO_SCRUB, percentage);
    };

  const getXForPlayed = (played) => {
    const timelineHolder = document.getElementById("axis-wrapper");
    if (!timelineHolder) {
      return 0;
    }

    const ratio = duration / timelineHolder.offsetWidth;
    return played === 0 ? 0 : played / ratio;
  };

  // Jump to a time in the timeline when clicked.
  const jumpToTime = e => {
    const el = document.getElementById("axis-wrapper").getBoundingClientRect();
    handleScrub(e.clientX - el.left);
  };

  return (
    <div className={styles.Timeline}>
      <div className={styles.TimelineAxis}>
        <div className={cx(styles.elementName, styles.startEndTimeHeading)} style={{textAlign:'left'}}>
          <small ><strong>&nbsp;</strong></small>
        </div>
        <div className={cx(styles.axisWrapper, styles.bars)} id="axis-wrapper" onClick={jumpToTime}>
          <PlayHead
            x={getXForPlayed(playedSeconds)}
            onChange={handleScrub}
          />{' '}
          <Axis duration={duration}/>
        </div>
        <div className={cx(styles.startEndTime, styles.startEndTimeHeading)} style={{textAlign:'left'}}>
          <small><strong style={{paddingLeft: '11px'}}>TIME IN</strong><strong style={{paddingLeft: '23px'}}>TIME OUT</strong></small>
        </div>
      </div>
      <div className={styles.interactionsWrapper}>
        <div className={styles.interactions}  id="timeline-bar-holder">{children}</div>
      </div>
    </div>
  );
};
export default Timeline;

const Axis = ({duration}) => {
  let markerCount = 10;

  return (
    <div className={styles.axis}>
      {times(markerCount, i => (
        <div className={styles.marker} key={i}>
          <Time s={i * duration / markerCount} />
        </div>
      ))}
    </div>
  );
};


class _Timeline extends Component {
  state = {
    muted: false,
    grid: false
  };

  static defaultProps = {
    markerCount: 6
  };




  toggleMuted = () => {
    this.setState(prevState => {
      return {muted: !prevState.muted};
    });

    // TODO Mute / Unmute the video
  };

  skipToEnd = () => {
    this.props.onScrub(0.99);
  };

  skipToStart = () => {
    this.props.onScrub(0);
  };



  getTimelineHeight(){
    return {
      height: window.innerHeight - (140 + 405 + 36 + 31 + 1) +'px'
    }
  }

  render() {
    const {duration, playing, played, play, pause, children, muted, grid, toggleMuted, toggleGrid} = this.props;
    const timelineHeight = this.getTimelineHeight();

  }
}

function PlayPause({playing, play, pause, skipToStart, skipToEnd}) {
  return (
    <div className={styles.PlayPause}>
      <Icon pointer  size="sm" icon="fast-backward" onClick={skipToStart} />
      {playing ? (
        <Icon pointer icon={['far','pause-circle']} size="2x" secondary onClick={pause} />
      ) : (
        <Icon pointer icon={['far','play-circle']}  size="2x"  secondary onClick={play} />
      )}
      <Icon pointer  size="sm" icon="fast-forward" onClick={skipToEnd} />
    </div>
  );
}
