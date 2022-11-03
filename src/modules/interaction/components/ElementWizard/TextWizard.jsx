import React from 'react';
import PropTypes from 'prop-types';
import ElementWizard from './ElementWizard';
import NameStep from './NameStep';
import TextStep from './TextStep';
import TimelineStep from './TimelineStep';
// import Copy from './Copy';

const stepsMeta = [
  { title: 'Element Name' },
  { title: 'Element Text' },
  // { title: 'Timeline' }
];

const TextWizard = props => {
  return (
    <ElementWizard {...props} stepsMeta={stepsMeta}>
      <NameStep {...props} />
      <TextStep {...props} />
      {/*<TimelineStep {...props} />*/}
    </ElementWizard>
  );
};

TextWizard.propTypes = {
  // element,
  // interaction,
  // mediaItem, // used by timeline Step for preview
  // updateElement,
  // updateInteraction,
  // onSave,
  // onSkip,
  // elementTypeName, // adjusted name of element type
  // onStepChange:  // callback to use on the wizard on Step Change
  // activeStep,  // the current active step , updated by onStepChange callback
};

export default TextWizard;
