// Vendors
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Swal from 'sweetalert2';
import cx from 'classnames';

// Other stuff
import { addInteraction, receiveInteraction, interactionDeleted } from 'utils.js';
import {receiveModal} from 'modules/modal';
import { receiveElement, receiveElements } from 'modules/element';
import { splitElementFromObj, processElements } from 'modules/element/elementUtils';
import {
  TEXT_ELEMENT,
  BUTTON_ELEMENT,
  TRIGGER_ELEMENT,
  FORM_ELEMENT,
  CUSTOM_HTML_ELEMENT,
  IMAGE_ELEMENT,
  HOTSPOT_ELEMENT,
  formatElementTypeName
} from 'modules/element/elements';
import styles from './ElementWizard.module.scss';

//  Components
import ButtonWizard from './ButtonWizard';
import TextWizard from './TextWizard';
import ImageWizard from './ImageWizard';
import FormWizard from './FormWizard';
import HotspotWizard from './HotspotWizard';
import CustomHtmlWizard from './CustomHtmlWizard';
import ModalWizard from './ModalWizard';
import { selectInteraction } from 'modules/interaction/interaction';

const _proptypes = {
  node: PropTypes.object,
  mediaItem: PropTypes.object.isRequired,
  elementType: PropTypes.string.isRequired,
  elementPosition: PropTypes.object.isRequired,
  // onSaveElement: PropTypes.func.isRequired,
  close: PropTypes.func
};

// create the draft interaction that we'll use in the wizard
// First it creates a draft interaction, then saves the interaction and element
// in the wizard's local state to which it updates during all changes
// keeps couple flags for copying or using templates , onSave handles it all or discard
// and delete draft interaction and sub objects onCancel
function ElementWizardContainer({ node, mediaItem, elementGroups, elementType, elementPosition, close }) {
  const [activeStep, setActiveStep] = useState(1);
  const [fetching, setFetching] = useState(false);

  const [interaction, setInteraction] = useState({
    pos: elementPosition,
    // timeIn: 0,
    // timeOut: 0,
    // pause_when_shown: false,
    // Hacky way of handling dynamic text not actually being supported
    //  in the DB as it's own element type
    element_type: elementType,
    dynamic: false,
  });

  const [element, setElement] = useState({});
  const [modal, setModal] = useState({});

  const dispatch = useDispatch();

  const duration = useSelector(nodeDurationSelector);

  const elementTypeName = formatElementTypeName(interaction.element_type);


  useEffect(() => {
    createDraftData();

    async function createDraftData() {
      const { project_id: projectId, id: nodeId } = node;
  
      setFetching(true);
  
      const dataRes = await phpApi(`interactions`, {
        method: 'post',
        body: {
          nodeId: parseInt(nodeId),
          projectId: parseInt(projectId),
          ...interaction,
          timeIn: window.currentVideoPlayedSeconds || 0,
          timeOut: duration || 60
        }
      });
      
      const { interaction: draftInteraction, modal:draftModal } = await dataRes.json();
      const [_interaction, _element] = splitElementFromObj(draftInteraction);
  
      updateInteractionData(_interaction);
      updateElementData(_element);
      if(draftModal) {
        updateModalData(draftModal);
      }
      setFetching(false);
    }
  }, []);


  function updateInteractionData(data) {
    setInteraction({ ...interaction, ...data });
  }

  function updateElementData(data) {
    setElement({ ...element, ...data });
  }

  function updateModalData(data) {
    setModal(prevModal => ({ ...prevModal, ...data }));
  }

  /** Finishing step of wizard , saves interaction from the state and appends to it the edited element  */
  async function finish(data = { ...interaction, element }) {
    try {
      setFetching(true);
      const res = await phpApi(`interactions`, {
        method: 'PUT',
        body: { ...data, draft: 0 }
      });
      const result = await res.json();
      
      const [savedInteraction, savedElement] = splitElementFromObj(result.interaction);
      // ⚡ order actually matters here , element 1st
      dispatch(receiveElement(savedElement));
      dispatch(receiveInteraction(savedInteraction));

      // update redux with modal as well if relevant
      if(interaction.element_type === TRIGGER_ELEMENT && result.modal){
        // console.log('modal data from the finish method after saving ........... ', result.modal)
        const [_modals, _elements] = processElements([result.modal])
        dispatch(receiveModal(_modals[0]))
        dispatch(receiveElements(_elements))
      }

      dispatch(selectInteraction(savedInteraction))
      setFetching(false);
      close();
    } catch (error) {
      //@TODO: alert user element didn't save
      setFetching(false);
    }
  }

  async function handleSaveElement() {
    finish();
  }

  function handleSkipWizard() {
    finish();
  }

  async function handleCancelWizard() {
    const conf = await Swal.fire({
      title: 'Are you sure?',
      text: 'Are you sure you want to cancel ?',
      icon: 'warning',
      showCloseButton: true,
      showCancelButton: true,
      confirmButtonColor: '#ff6961',
      confirmButtonText: 'Yes'
    });

    // delete interaction AND related objects
    try {
      setFetching(true);
      await phpApi(`interactions/${interaction.id}`, { method: 'DELETE' });
      dispatch(interactionDeleted(interaction.id));
      close();
    } catch (error) {
      setFetching(false);
    }
  }

  function handleStepChange({ previousStep, activeStep }) {
    setActiveStep(activeStep);
  }

  const renderElementWizard = elementType => {
    const props = {
      fetching,
      node,
      element,
      interaction,
      modal,
      elementGroups, // used for grouping in naming step
      mediaItem, // used by timeline Step for preview
      updateElement: updateElementData,
      updateInteraction: updateInteractionData,
      updateModal: updateModalData,
      onSave: handleSaveElement,
      onSkip: handleSkipWizard,
      onAbort: handleCancelWizard,
      elementTypeName, // adjusted name of element type
      onStepChange: handleStepChange, // callback to use on the wizard on Step Change
      activeStep // the current active step , updated by onStepChange callback
    };

    switch (elementType) {
      case BUTTON_ELEMENT:
        return <ButtonWizard {...props} />;
      case HOTSPOT_ELEMENT:
        return <HotspotWizard {...props} />;
      case IMAGE_ELEMENT:
        return <ImageWizard {...props} />;
      case TEXT_ELEMENT:
        return <TextWizard {...props} />;
      case CUSTOM_HTML_ELEMENT:
        return <CustomHtmlWizard {...props} />;
      case TRIGGER_ELEMENT:
        return <ModalWizard {...props} />;
      case FORM_ELEMENT:
        return <FormWizard {...props} />;
      default:
        return null;
    }
  };

  return renderElementWizard(interaction.element_type);
}

ElementWizardContainer.propTypes = _proptypes;

export default ElementWizardContainer;
