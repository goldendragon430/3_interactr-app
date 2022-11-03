import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { splitElementFromObj, processElements } from 'modules/element/elementUtils';
import styles from './CopyModalComponent.module.scss';
import { Option, SelectInput } from 'components/PropertyEditor';
import Button from 'components/Buttons/Button';
// import Icon from 'components/Icon';
// import Spinner from 'components/Spinner';
// import filter from 'lodash/filter';

const CopyInteractionLayerComponentProps = {
  onDone: PropTypes.func
};

function CopyInteractionLayerComponent({ onDone }) {
  const [_selectedNode, _setSelectedNode] = useState({ name: 'Select Node' });
  const [copying, setCopying] = useState(false);

  const { nodeId } = useParams();
  const { nodes, currentNode } = useSelector(getCopyInteractionLayerSelector(nodeId));
  const { selectedModal } = useSelector(selectedModalSelector);

  const dispatch = useDispatch();

  const handleNodeChange = (e, selected) => {
    // can take the default object just instructing to use dropdown
    if (!selected.id) return;
    // setSelectedInteraction for preview
    _setSelectedNode(selected);
    // onCopy && onCopy(selectedInteraction.id);
  };

  async function handleCopy() {
    try {
      setCopying(true);
      // node with IL selected
      if (_selectedNode && _selectedNode.interaction_layer_id) {
        // get the interaction layer's modal
        const res = await phpApi(`interactions/${_selectedNode.interaction_layer_id}`);
        const { modal: modalToCopy } = await res.json();

        // if node has no IL yet create a new one
        if (currentNode && !currentNode.interaction_layer_id) {
          const res = await phpApi(`interactions`, {
            method: 'post',
            body: {
              projectId: currentNode.project_id,
              nodeId: currentNode.id,
              element_type: TRIGGER_ELEMENT,
              interaction_layer: 1
            }
          });
          const { interaction: newInteraction, modal: newModal, node } = await res.json();

          const savedModal = await copyModal(modalToCopy.id, newModal.id);
          updateRedux(savedModal, node)
          onDone && onDone();
        } else if (selectedModal) {
          // apply to already saved IL as selectedModal from redux
          const savedModal = await copyModal(modalToCopy.id, selectedModal.id);
          updateRedux(savedModal)
          onDone && onDone();
        }
      }
    } finally {
      setCopying(false);
    }
  }
  
  async function copyModal(templateId, modalId) {
    // copy/apply target modal data on current modal
    const modalRes = await phpApi(`modals/applyTemplate`, {
      method: 'post',
      body: { templateId, modalId }
    });
    return await modalRes.json();

  }
  
  function updateRedux(savedModal, savedNode){
    // Update Redux with new modal data
    const [_modals, _elements] = processElements([savedModal]);
    dispatch(receiveModal(_modals[0]));
    dispatch(receiveElements(_elements));
    
    if(savedNode) {
      dispatch(updateNode(savedNode.id, savedNode, true))
    }
    
  }

  // no preview for default one
  const showPreview = _selectedNode && _selectedNode.id;

  // filter out current node 
  const ilNodes = nodes.filter(n => n.id != currentNode.id);

  return (
    <div className={cx(styles.copyElement_step, styles.step_wrapper)}>
      <div>
        <div className={styles.elements_dropdown}>
          <h3>Select Node to copy it&apos;s Interaction Layer</h3>
          <Option
            value={_selectedNode}
            Component={SelectInput}
            options={ilNodes}
            labelKey="name"
            onChange={handleNodeChange}
          />
          <Button secondary noFloat small onClick={() => handleCopy(_selectedNode.id)} icon="copy" loading={copying}>
            Copy
          </Button>
        </div>
      </div>
    </div>
  );
}


CopyInteractionLayerComponent.propTypes = CopyInteractionLayerComponentProps;

export default CopyInteractionLayerComponent;
