import React, {useState} from 'react';
import Button from "../../../components/Buttons/Button";
import TemplateListComponent from "../../template/components/TemplateListComponent";

const ChangeTemplateButton = ({modal}) => {
  const [showTemplatesModal, setShowTemplatesModal] = useState(false);
  const { interaction_layer } = modal;

  return(
    <>
      <Button
        secondary
        icon="pen-square"
        right
        onClick={()=>setShowTemplatesModal(true)}
        style={{ marginBottom: 10 }}
      >
        Change Preset Template
      </Button>

      {showTemplatesModal && (
        <TemplateListComponent
          resource="modals"
          filter={interaction_layer ? 'interaction_layer' : undefined}
          interactionLayerPopup={interaction_layer}
          title="Change Preset Template"
          height={650}
          show={showTemplatesModal}
          onClose={()=>setShowTemplatesModal(false)}
          // onSelectTemplate={this.handleSelectTemplate}
        />
      )}
    </>
  )
};
export default ChangeTemplateButton;