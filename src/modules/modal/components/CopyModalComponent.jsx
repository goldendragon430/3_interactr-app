import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import cx from 'classnames';
import styles from './CopyModalComponent.module.scss';
import { getStyles, BUTTON_ELEMENT, FORM_ELEMENT, TRIGGER_ELEMENT } from 'modules/element/elements';
import { splitElementFromObj, processElements } from 'modules/element/elementUtils';
import ButtonElement from 'modules/element/components/Element/ButtonElement';
import FormElement from 'modules/element/components/Element/FormElement';
import { Option, SelectInput } from 'components/PropertyEditor';
import Spinner from 'components/Spinner';
import Button from 'components/Buttons/Button';
// import Icon from 'components/Icon';
// import filter from 'lodash/filter';


const CopyModalComponentProps = {
  onDone: PropTypes.func,
};

function CopyModalComponent({ onDone }) {
  const [_selectedInteraction, _setSelectedInteraction] = useState({ label: 'Select Popup' });
  const [copying, setCopying] = useState(false);

  const dispatch = useDispatch();
  const { nodeId } = useParams();

  const { selectedInteraction, selectedModal } = useSelector((state) => selectedInteractionSelector(state, { nodeId }));
  const { interactions } = useSelector(getInteractionsWithTypeSelector(TRIGGER_ELEMENT));
  const { modals } = useSelector(projectModalsSelector);
  // interaction id is needed to duplicate the interaction

  const modalInteractions = interactions.reduce((acc, _interaction) => {
    if (selectedInteraction && _interaction.id == selectedInteraction.id) return acc; // filter out the current interaction
    if (_interaction.element_type === TRIGGER_ELEMENT && modals.length) {
      const interactionModal = modals.find((m) => m.id == _interaction.element.actionArg);
      if (interactionModal && interactionModal.interaction_layer) return acc; // No ILs
      // append modal to it's interaction
      _interaction.modal = interactionModal;
    }
    return [...acc, { ..._interaction, label: _interaction.element.name }];
  }, []);

  const handleModalChange = (e, selected) => {
    // can take the default object just instructing to use dropdown
    if (!selected.id) return;
    // setSelectedInteraction for preview
    _setSelectedInteraction(selected);
  };

  async function handleCopy(interactionId) {
    // the entire component is only used if a modal is already created
    // and is being edited hence usage of selectedModal from redux
    if (selectedModal) {
      try {
        setCopying(true);
        // get the target modal's interaction and element
        const res = await phpApi(`interactions/${interactionId}`);

        // let [targetTriggerInteraction, targetTrigger] = splitElementFromObj(await res.json());
        const { modal: modalToCopy } = await res.json();

        // copy/apply target modal data on current modal
        const modalRes = await phpApi(`modals/applyTemplate`, {
          method: 'post',
          body: { templateId: modalToCopy.id, modalId: selectedModal.id },
        });
        const newModal = await modalRes.json();

        updateRedux(newModal);
        onDone && onDone();
      } finally {
        setCopying(false);
      }
    }
  }
  function updateRedux(savedModal) {
    // Update Redux with new modal data
    const [_modals, _elements] = processElements([savedModal]);
    dispatch(receiveModal(_modals[0]));
    dispatch(receiveElements(_elements));
  }
  // no preview for default one
  const showPreview = _selectedInteraction && _selectedInteraction.id;

  return (
    <div className={cx(styles.copyElement_step, styles.step_wrapper)}>
      <div>
        <div className={styles.elements_dropdown}>
          <h3>Select modal to Copy</h3>
          <Option
            value={_selectedInteraction}
            Component={SelectInput}
            options={modalInteractions}
            onChange={handleModalChange}
          />
          <Button
            secondary
            noFloat
            small
            icon="copy"
            loading={copying}
            onClick={() => {
              _selectedInteraction.id && handleCopy(_selectedInteraction.id);
            }}
          >
            Copy
          </Button>
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
                  {..._selectedInteraction}
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
      return <p>Previews for popups are coming soon...</p>;

    default:
      return <p>Preview unavailable</p>;
  }
}

CopyModalComponent.propTypes = CopyModalComponentProps;

export default CopyModalComponent;
