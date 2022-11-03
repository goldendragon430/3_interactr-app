import React from 'react';
import PropTypes from 'prop-types';
import ElementWizard from './ElementWizard';
import NameStep from './NameStep';
import AppearanceStep from './AppearanceStep';
// import ActionsStep from './ActionsStep';
import TimelineStep from './TimelineStep';
// import Copy from './Copy';

const stepsMeta = [
  { title: 'Element Name' },
  { title: 'Element Appearance' },
  // { title: 'Element Action' },
  // { title: 'Timeline' }
];

const ModalWizard = props => {
  return (
    <ElementWizard {...props} stepsMeta={stepsMeta}>
      <NameStep {...props} noGrouping />
      <AppearanceStep {...props} />
      {/* <ActionsStep {...props} /> */}
      {/*<TimelineStep {...props} />*/}
    </ElementWizard>
  );
};

ModalWizard.propTypes = {
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

export default ModalWizard;
