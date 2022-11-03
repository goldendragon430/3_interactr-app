import React, { useState } from 'react';
import PropTypes from 'prop-types';
// import cx from 'classnames';
// components
import Icon from 'components/Icon';
import CopyElementStep from './CopyElementStep';
import TemplateStep from './TemplateStep';
// othe stuff
import { splitElementFromObj, processElements } from 'modules/element/elementUtils';
import { TRIGGER_ELEMENT } from 'modules/element/elements';
import styles from './ElementWizard.module.scss';

const appearanceStepProps = {
  elementTypeName: PropTypes.string,
  onUseCopyOption: PropTypes.func.isRequired,
  onUseTemplateOption: PropTypes.func.isRequired,
  /** function to navigate to next step passed from wizard */
  nextStep: PropTypes.func
};
function AppearanceStep(props) {
  const [showCopyElementStep, setShowCopyElementStep] = useState(false);
  const [showTemplateStep, setShowTemplateStep] = useState(false);

  const {
    node,
    interaction,
    element,
    modal,
    elementTypeName,
    updateInteraction,
    updateElement,
    updateModal,
    nextStep,
    currentStep,
    isActive,
    onSave,
    totalSteps
  } = props;

  const isLastStep = isActive && currentStep === totalSteps;

  const [copying, setCopying] = useState(false);

  async function handleCopyElement(interactionId) {
    try {
      setCopying(true);
      const res = await phpApi(`interactions/${interactionId}`);
      const {interaction: targetInteraction , modal:targetModal} = await res.json();
      let [originalInteraction, originalElement] = splitElementFromObj(targetInteraction);

      // We're overwriting local wizard data but some properties shouldn't be changed by new copied
      // values from interaction
      let { pause_when_shown } = originalInteraction;
      let {
        id, // remove the id of the new element
        name, // leave these properties out as they're being edited in other steps of wizard
        posX, // or shouldn't overwrite the rest
        posY,
        ...copiedElementPropertiesToUse
      } = originalElement;

      // Handle the case of a modal copying .
      if (interaction.element_type === TRIGGER_ELEMENT && targetModal) {
        // copy the modal itself after it's trigger interaction and element have been copied
        const modalRes = await phpApi(`modals/copy/${targetModal.id}`, { method: 'post' });
        const newModal = await modalRes.json();

        const { name, ...newModalData } = newModal;
        // link the new trigger to new modal
        copiedElementPropertiesToUse.actionArg = newModal.id;
        updateModal(newModalData);
        // delete previously created modal as a draft , we don't need to wait for request
        phpApi(`modals/${element.actionArg}`, { method: 'delete' });
      }

      // Update the draft Interaction and element. ⚡ order matters
      updateElement(copiedElementPropertiesToUse);
      updateInteraction({ pause_when_shown });

    } finally {
      setCopying(false);
    }
  }

  async function handleUseTemplate(templateId) {
    if (interaction.element_type === TRIGGER_ELEMENT) {
      const { action, actionArg } = element;
      if (action == 'openModal' && !!actionArg) {
        // apply the template
        const res = await phpApi(`modals/applyTemplate/`, {
          method: 'POST',
          body: { templateId: templateId, modalId: actionArg }
        });

        const { name, ..._modal } = await res.json();
        // console.log('modal to update in Wizard after template applied', _modal);
        updateModal(_modal);
        onSave(); // save and close wizard
      } else console.error('element action and actionAr are not set properly ', element);
    }
  }

  function renderCopyElementStep() {
    setShowCopyElementStep(true);
  }
  function renderUseTemplateStep() {
    setShowTemplateStep(true);
  }
  function resetAppearance() {}

  // only modals use templates for now
  const supportsTemplates = interaction.element_type === TRIGGER_ELEMENT;
  // only modals shouldn't copy
  // const supportsCopying = interaction.element_type !== TRIGGER_ELEMENT;
  const supportsCopying = true;

  const showOptions = !showCopyElementStep && !showTemplateStep;
  return (
    <div className={styles.appearance_step}>
      <h3 style={{ textAlign: 'center' }}>What type of {elementTypeName || 'Element'} would you like to create ?</h3>
      {showOptions && (
        <Options
          supportsTemplates={supportsTemplates}
          supportsCopying={supportsCopying}
          onUseCopyOption={renderCopyElementStep}
          onUseTemplateOption={renderUseTemplateStep}
          resetAppearance={resetAppearance}
          isLastStep={isLastStep}
          {...props}
        />
      )}

      {showCopyElementStep && <CopyElementStep node={node} interaction={interaction} copying={copying} onCopy={handleCopyElement} />}
      {showTemplateStep && <TemplateStep interaction={interaction} onUseTemplate={handleUseTemplate} />}
    </div>
  );
}

AppearanceStep.propTypes = appearanceStepProps;

export default AppearanceStep;

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

function Options({
  elementTypeName,
  resetAppearance,
  supportsTemplates,
  supportsCopying,
  onUseCopyOption,
  onUseTemplateOption,
  nextStep,
  isLastStep,
  ...props
}) {
  return (
    <div className={styles.wrapper}>
      <AppearanceActionButton
        icon="plus"
        title="New"
        onClick={() => {
          // reset copying and using templates from data
          resetAppearance();
          if (isLastStep) props.onSave();
          else nextStep();
        }}
      >
        Create a new {elementTypeName} from scratch
      </AppearanceActionButton>
      {supportsCopying && (
        <AppearanceActionButton
          icon="copy"
          title="Copy"
          onClick={() => {
            resetAppearance();
            onUseCopyOption();
          }}
        >
          Copy one of your previously created {elementTypeName}s
        </AppearanceActionButton>
      )}
      {/*  Only show template option for modals */}
      {supportsTemplates && (
        <AppearanceActionButton
          icon="photo-video"
          title="Template"
          onClick={() => {
            resetAppearance();
            onUseTemplateOption();
          }}
        >
          Create a new {elementTypeName} one from our templates.
        </AppearanceActionButton>
      )}
    </div>
  );
}
