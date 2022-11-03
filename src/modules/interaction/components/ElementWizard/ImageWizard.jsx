import React from 'react';
import PropTypes from 'prop-types';
import ElementWizard from './ElementWizard';
import NameStep from './NameStep';
import ImageUploadStep from './ImageUploadStep';
import ActionsStep from './ActionsStep';
import TimelineStep from './TimelineStep';
// import Copy from './Copy';

const stepsMeta = [
  { title: 'Element Name' },
  { title: 'Image Source' },
  { title: 'Element Action' },
  //{ title: 'Timeline' }
];

const ImageWizard = props => {
  return (
    <ElementWizard {...props} stepsMeta={stepsMeta}>
      <NameStep {...props} />
      <ImageUploadStep {...props} />
       <ActionsStep {...props} />
      {/*<TimelineStep {...props} />*/}
    </ElementWizard>
  );
};

ImageWizard.propTypes = {
  // element,
  // interaction,
  // mediaItem, // used by timeline Step for preview
  // updateElement,
  // updateInteraction,
  // onSave: handleSaveElement,
  // onSkip: handleSkipWizard,
  // elementTypeName, // adjusted name of element type
  // onStepChange: handleStepChange, // callback to use on the wizard on Step Change
  // activeStep,  // the current active step , updated by onStepChange callback
};

export default ImageWizard;
