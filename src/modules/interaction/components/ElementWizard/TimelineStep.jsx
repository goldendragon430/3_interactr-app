import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import { TRIGGER_ELEMENT } from 'modules/element/elements';

// components
import styles from './ElementWizard.module.scss';
import VideoPlayer from 'components/VideoPlayer';
import { Option, TimeInput } from 'components/PropertyEditor';

const timelineStepProps = {
  /** The media item */
  mediaItem: PropTypes.object.isRequired,
  /** Called after updating any element data  */
  updateInteraction: PropTypes.func.isRequired,
  /** Element data that populates the actions  */
  interaction: PropTypes.object.isRequired
};

const TimelineStep = ({ mediaItem, interaction, updateInteraction, nextStep, previousStep, totalSteps }) => {


  const changeHandler = name => (e, val) => {
    console.log(`handler from ${name} `, val);
    updateInteraction({ [name]: val });
  };

  // const handleProgress =  ({playedSeconds}) => {
  //   // if (playedSeconds == undefined) return;
  //   console.log('Played seconds from handleProgress.... : ', progressObject);
  // }
  const onDuration = duration => {
    console.log('on Duration method from the player in the wizard timeline step ... \n', duration)
    updateInteraction({ timeOut: duration });
  };
  return (
    <div className={cx(styles.timeline_step, styles.step_wrapper)}>
      <h3>Timing Setup</h3>

      <div className={styles.wrapper}>
        <div className={styles.options}>
          <Option
            label="Time in (m:s::ms)"
            value={interaction.timeIn}
            onChange={changeHandler('timeIn')}
            Component={TimeInput}
            // interactionId={id}
            // initMount={this.state.initMount}
          />
          {interaction.element_type !== TRIGGER_ELEMENT && (
            <Option
              label="Time out (m:s::ms)"
              value={interaction.timeOut}
              onChange={changeHandler('timeOut')}
              Component={TimeInput}
              // interactionId={id}
              // initMount={this.state.initMount}
            />
          )}
        </div>
        <div className={styles.preview}>
          <VideoPlayer
            url={mediaItem.url}
            controls
            //  onProgress={handleProgress}
            onDuration={onDuration}
          />
        </div>
      </div>
    </div>
  );
};

TimelineStep.propTypes = timelineStepProps;

export default TimelineStep;
