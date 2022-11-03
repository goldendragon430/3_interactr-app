import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactWizard from './BaseWizard';
import styles from './Wizard.module.scss';
import Modal from 'components/Modal';
import Icon from 'components/Icon';
import Button from 'components/Buttons/Button';
import Spinner from 'components/Spinner';

const wizardProps = {
  /** Whether or not to show the modal */
  show: PropTypes.bool,
  /** title of the wizard modal */
  title: PropTypes.string.isRequired,
  /** onSave fires when the wizard is done */
  onSave: PropTypes.func.isRequired,
  /** Callback for cancelling the wizard or closing it */
  onAbort: PropTypes.func,
  /** A component that renders as the stepper of the wizard */
  Stepper: PropTypes.element,
  /** function that gets passed the underlying StepWizard instance */
  instance: PropTypes.func,
  /** Callback that gets the step change info object {previousStep, activeStep} */
  onStepChange: PropTypes.func
};

class Wizard extends Component {
  closeWizard = () => {
    const { onAbort } = this.props;
    onAbort && onAbort();
  };
  handleSave = () => {
    this.props.onSave && this.props.onSave();
  };


  render() {
    const {
      show,
      title,
      children,
      fetching,
      onSave,
      onSkip,
      width,
      height,
      Stepper,
      instance,
      onStepChange,
      ...restOfProps
    } = this.props;

    return (
      <Modal 
        show={show}
        onClose={this.closeWizard}
        height={height || 800}
        width={width || 800}
        heading={title}
      >
        <div className="h-100">
          {React.isValidElement(Stepper) && Stepper}
          {fetching ? (
            <Spinner />
          ) : (
            <ReactWizard
              isLazyMount
              onStepChange={onStepChange}
              instance={instance}
              nav={<WizardNav onSave={this.handleSave} onAbort={this.closeWizard} onSkip={onSkip} />}
              className={styles.wizard_wrapper}
            >
              {children}
            </ReactWizard>
          )}
        </div>
      </Modal>
    );
  }
}

Wizard.propTypes = wizardProps;

function WizardNav({ currentStep, nextStep, previousStep, totalSteps, isActive, onSave, onSkip, onAbort }) {
  const isLastStep = currentStep === totalSteps;
  const isFirstStep = currentStep === 1;
  return (
    <div className={styles.actions_wrapper}>
      <div>
        <Button
          icon={isFirstStep ? 'times' : 'arrow-left'}
          noFloat
          // disabled={isFirstStep}
          onClick={isFirstStep ? onAbort : previousStep}
        >
          {isFirstStep ? 'Cancel' : 'Back'}
        </Button>
      </div>
      <div>
        {// Only show skip wizard button when not on the last step
        !isLastStep && (
          <Button secondary onClick={onSkip} noFloat>
            Skip Wizard
          </Button>
        )}
        <Button
          primary
          // icon={!isLastStep && 'arrow-right'}
          noFloat
          //  disabled={isLastStep}
          onClick={isLastStep ? onSave : nextStep}
        >
          {isLastStep ? 'Done' : 'Next'} <Icon name="arrow-right" />
        </Button>
      </div>
    </div>
  );
}

export default Wizard;
