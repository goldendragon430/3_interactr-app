import React from 'react';
import PropTypes from 'prop-types';
import styles from './ElementWizard.module.scss';
//  components
import Icon from 'components/Icon';

const optionsProps = {
  elementTypeName: PropTypes.string,
  onUseCopyOption: PropTypes.func.isRequired,
  onUseTemplateOption: PropTypes.func.isRequired,
  /** the entire props passed from the top wizard through appearance step including steps navigation functions etc... */
  topWizardProps: PropTypes.object.isRequired,
  /** function to navigate to next step passed from wizard */
  nextStep: PropTypes.func,
}

export default function OptionsStep({ elementTypeName, nextStep, goToStep, lastStep, topWizardProps, onUseTemplateOption, onUseCopyOption }) {
  return (
    <div className={styles.appearance_step}>
      <h3>What type of {elementTypeName || "Element"} would you like to create ?</h3>

      <div className={styles.wrapper}>
        <AppearanceActionButton
          icon="plus"
          title="New"
          onClick={() => {
            // nextStep();
            // skips to next top step
            topWizardProps.nextStep();
          }}
        >
          Create a new {elementTypeName} from scratch
        </AppearanceActionButton>
        <AppearanceActionButton
          icon="photo-video"
          title="Template"
          onClick={() => {
            onUseTemplateOption();
            goToStep(2);
          }}
        >
          Create a new {elementTypeName} one from our templates.
        </AppearanceActionButton>
        <AppearanceActionButton
          icon="copy"
          title="Copy"
          onClick={() => {
            onUseCopyOption();
            goToStep(3);
          }}
        >
          Copy one of your previously created {elementTypeName}s
        </AppearanceActionButton>
      </div>
    </div>
  );
}
OptionsStep.propTypes = optionsProps;

function AppearanceActionButton({ icon, title, children, onClick }) {
  return (
    <div className={styles.appearance_action} onClick={onClick}>
      <div className={styles.icon_wrapper}>
        <Icon icon={icon} size="4x" />
      </div>
      <h3>{title}</h3>
      <span>{children}</span>
    </div>
  );
}
