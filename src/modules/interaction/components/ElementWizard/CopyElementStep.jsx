import React, { useState } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
// import filter from 'lodash/filter';

// other stuff
import styles from './ElementWizard.module.scss';
import { getInteractionsWithTypeSelector } from 'modules/interaction/interactionSelectors';
import { projectModalsSelector } from 'modules/modal/modalSelectors';
import { getStyles, BUTTON_ELEMENT, FORM_ELEMENT, TRIGGER_ELEMENT } from 'shared/element';

// components
// import Icon from 'components/Icon';
import ButtonElement from 'modules/element/components/Element/ButtonElement';
import FormElement from 'modules/element/components/Element/FormElement';
import { Option, SelectInput } from 'components/PropertyEditor';
import Spinner from 'components/Spinner';

const copyElementStepProps = {
  /** Element data that populates the actions  */
  interaction: PropTypes.object.isRequired,
  /** Sets the interaction id needed for copying
   * @param {String} interactionId the id of interaction to copy
   */
  onCopy: PropTypes.func.isRequired,
  copying: PropTypes.bool,
};

function CopyElementStep({
  interaction,
  onCopy,
  copying,
  ...props // passed from appearance step
  // rest of props from baseWizard as this is it's child
}) {
  const [selectedInteraction, setSelectedInteraction] = useState({ label: 'Select Element' });
  let { interactions } = useSelector(getInteractionsWithTypeSelector(interaction.element_type));
  const { modals } = useSelector(projectModalsSelector);
  // interaction id is needed to duplicate the interaction

  const elements = interactions.reduce((acc, _interaction) => {
    if (_interaction.draft || _interaction.id == interaction.id) return acc; // only already saved interactions and not the current one
    if (_interaction.element_type === TRIGGER_ELEMENT && modals.length) {
      const interactionModal = modals.find(m => m.id == _interaction.element.actionArg);
      if (interactionModal && interactionModal.interaction_layer) return acc; // No ILs
      // append modal to it's interaction
      _interaction.modal = interactionModal;
    }
    return [...acc, { ..._interaction, label: _interaction.element.name }];
  }, []);


  const handleElementChange = (e, selectedInteraction) => {
    // can take the default object just instructing to use dropdown
    if (!selectedInteraction.id) return;
    // setSelectedInteraction for preview
    setSelectedInteraction(selectedInteraction);
    onCopy && onCopy(selectedInteraction.id);
  };

  // no preview for default one
  const showPreview = selectedInteraction && selectedInteraction.id;

  return (
    <div className={cx(styles.copyElement_step, styles.step_wrapper)}>
      <div>
        <div className={styles.elements_dropdown}>
          <h3>Select Element to Copy</h3>
          <Option
            value={selectedInteraction}
            Component={SelectInput}
            options={elements}
            onChange={handleElementChange}
          />
        </div>
        <div className={styles.element_preview}>
          <h3>Preview</h3>
          <div>
            {showPreview &&
              (copying ? (
                <Spinner style={{ marginTop: 30 }} />
              ) : (
                <ElementPreview
                  positionable={false}
                  {...selectedInteraction}
                  posX={20}
                  posY={20}
                  disableResize // disables resizing
                />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ElementPreview({ element_type, ...props }) {
  switch (element_type) {
    case BUTTON_ELEMENT:
      return <ButtonElement {...props.element} />;
    case FORM_ELEMENT:
      return <FormElement {...props.element} />;
    case TRIGGER_ELEMENT:
      return <p>Previews for popups are coming soon...</p>

    default:
      return <p>Preview unavailable</p>;
  }
}

CopyElementStep.propTypes = copyElementStepProps;

export default CopyElementStep;
