import find from "lodash/find";
import {deselectElement} from "../../element";
import {addInteraction, selectInteraction} from "../../interaction/utils";
import {applyModalTemplate} from "../../modal";
import {useState} from "react";


const InteractionLayerButton = () => {
  const [showInteractionLayerTemplates, setShowInteractionLayersTemplates] = useState(false);

  return(
    <div>
      {/* {!!project.legacy && (
        <Button secondary disabled>
            <span data-tip={'Only available on new projects'}>
              <Icon name="bullseye-pointer" /> Interaction Layer
            </span>
        </Button>
      )} */}
      {!project.legacy && (
        <div className="mr">
          {/*<BackButton link={`/projects/${projectId}`}  />*/}
          <Button secondary onClick={goToInteractionLayer}>
            <Icon name="bullseye-pointer" /> Interaction Layer
          </Button>
          {showInteractionLayerTemplates && (
            <TemplateListComponent
              resource="modals"
              filter="interaction_layer"
              title="Select Interaction Layer Preset"
              interactionLayerPopup
              show={showInteractionLayerTemplates}
              offerBlankOption={!node.interaction_layer_id}
              height={650}
              onClose={() => {
                setShowInteractionLayersTemplates(false);
              }}
              onSelectTemplate={handleSelectTemplate}
            />
          )}
        </div>
      )}
    </div>
  )
};

export default InteractionLayerButton;

const interactionLayer =
  !!node && !!node.interaction_layer_id && find(interactions, { id: node.interaction_layer_id });

const goToInteractionLayer = () => {
  // if interaction layer is already selected and we also have selected elements, on click interaction layer deselect elements
  if (selectedInteraction && interactionLayer && selectedInteraction.id == interactionLayer.id) {
    dispatch(deselectElement());
    return;
  }

  if (interactionLayer) {
    // Set the active interaction layer
    setSelectedInteraction(interactionLayer);
    onScrub(0.99);
  } else {
    // Open the new interaction layer Templates
    setShowInteractionLayersTemplates(true);
  }
};



function handleSelectTemplate(templateId) {
  // We must create the interaction 1st before applying the template to it's element
  // creating a trigger element auto creates a blank modal then if user chooses a template that'll be
  // applied through the callback , if not the blank modal is used . during which operation the node interaction_layer_id
  // is also appended in the backend
  dispatch(
    addInteraction(
      {
        projectId: project.id,
        nodeId: node.id,
        element_type: TRIGGER_ELEMENT,
        interaction_layer: 1,
      },
      addInteractionCallback
    )
  );


  // callback that fires after interaction holding interaction_layer modal
  function addInteractionCallback(interaction, element) {
    if (templateId) {
      // might be null if used blank template
      const { action, actionArg } = element;
      const modalTemplateData = {};
      if (action == 'openModal' && !!actionArg) {
        modalTemplateData.modalId = actionArg;
        dispatch(applyModalTemplate(templateId, { modalId: actionArg }), function applyModalCallback() {
          // this happens after the modal is created and template applied to it
          setSelectedInteraction(interaction);
        });
      }
    } else setSelectedInteraction(interaction); // used a blank interaction layer
    setShowInteractionLayersTemplates(false);
  }
}

function setSelectedInteraction(interaction) {
  dispatch(selectInteraction(interaction));
}