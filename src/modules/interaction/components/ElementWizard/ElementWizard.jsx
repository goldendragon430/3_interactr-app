import React from 'react';
import PropTypes from 'prop-types';
import Stepper from 'react-stepper-horizontal';

// Components
import Wizard from 'components/Wizard';

export default function ElementWizard({ children, activeStep, fetching, stepsMeta, onStepChange, onAbort, onSave, onSkip }) {
  return (
    <Wizard
      show={true}
      title="Add Element"
      fetching={fetching}
      Stepper={
        <div style={{
          background: '#F3F6FD',
          marginLeft: '-15px',
          marginRight: '-15px',
          marginTop: '-30px',
          paddingTop: '10px',
          paddingBottom: '20px',
        }}>
          <Stepper steps={stepsMeta} activeStep={getActiveStep(activeStep)} />
        </div>
      }
      onStepChange={onStepChange}
      onSkip={onSkip}
      onSave={onSave}
      onAbort={onAbort}
      height={650}
    >
      {/* Children are the steps passed into each elementWizard */}
      {children}
    </Wizard>
  );
}

ElementWizard.propTypes = {
  fetching: PropTypes.bool,
  onAbort: PropTypes.func.isRequired,
  onSkip: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  /** active step number */
  activeStep: PropTypes.number,
  /** Callback that updates activeStep */
  onStepChange: PropTypes.func,
  /** Meta stuff used by the stepper to show active step */
  stepsMeta: PropTypes.array.isRequired
};

ElementWizard.defaultProps = {
  stepsMeta: [{ title: 'Element Name' }, { title: 'Element Action' }, { title: 'Timeline' }]
};

function getActiveStep(step) {
  return Number.isInteger(step) && step > 0 ? step - 1 : 0;
}
