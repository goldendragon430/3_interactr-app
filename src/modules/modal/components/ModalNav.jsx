import React from 'react'
import ElementToolbar from 'modules/interaction/components/ElementToolbar';
import BreadcrumbBar from 'components/BreadcrumbBar';
import {
  someElements,
  TEXT_ELEMENT,
  BUTTON_ELEMENT,
  IMAGE_ELEMENT,
  FORM_ELEMENT,
  CUSTOM_HTML_ELEMENT
} from 'modules/element/elements';
import LinkButton from 'components/Buttons/LinkButton';
import SaveButton from "components/Buttons/SaveButton";
import {nodePath} from "../../node/routes";

const elements = someElements(TEXT_ELEMENT, BUTTON_ELEMENT, IMAGE_ELEMENT, FORM_ELEMENT, CUSTOM_HTML_ELEMENT);


export default class ModalNav extends React.Component {
  handleAddElement = (element_type, pos) => {
    const {modalId} = this.props.match.params;
    this.props.addModalElement(modalId, element_type, pos);
  };

  render() {
    const {modal, match: {params: {projectId, nodeId}}} = this.props;

    return (
      <BreadcrumbBar
        left={<h1>Edit Popup</h1>}
        right={
          <div style={{marginTop: '13px'}}>
            <div style={{float: 'right'}}>
              {/*<NodeActionDropdown projectId={projectId} nodeId={nodeId}/>*/}
              <SaveButton saveAction={()=>this.props.saveModal(modal.id, modal)}/>
            </div>
            <div style={{float: 'right'}}>
              <LinkButton  icon="chevron-left" to={nodePath({projectId: modal.project_id, nodeId})}>Back To Node</LinkButton>
            </div>
          </div>
        }
      />
    );
  }
}
