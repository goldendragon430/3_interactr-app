import React, { useState } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import reduce from 'lodash/reduce';

// stuff
import { addElementGroup } from 'modules/node';

// components
import Modal from 'components/Modal';
import Icon from 'components/Icon';
import Button from 'components/Buttons/Button';
import { Option, TextInput, SelectInput } from 'components/PropertyEditor';
import styles from './ElementWizard.module.scss';

export default function NameStep({ element, updateElement, elementGroups, interaction, updateInteraction, noGrouping }) {
  const [showGroupModal, setShowGroupModal] = useState(false);

  function toggleGroupModal() {
    setShowGroupModal(!showGroupModal);
  }
  const handleNameChange = e => {
    updateElement && updateElement({ name: e.target.value });
  };

  const updateInteractionElementGroup = (e, elementGroupId) => {
    elementGroupId = "0" === elementGroupId ? null : elementGroupId;
    updateInteraction({ element_group_id: elementGroupId });
  };

  const elementGroupsOptions = elementGroups
    ? reduce(
        elementGroups,
        (memo, value) => {
          memo[value.id] = value.name;
          return memo;
        },
        { 0: 'No Groups' }
      )
    : null;

  return (
    <div className={cx(styles.name_step, styles.step_wrapper)}>
      {/*<h3>Element Properties</h3>*/}
        <div className="grid">
            <div className="col12">
                <Option
                    label="Element Name"
                    value={element.name}
                    Component={TextInput}
                    onChange={handleNameChange}
                    placeholder="Name"
                />
            </div>
        </div>
      {!noGrouping && elementGroupsOptions ? (
        <div className="grid">
          <div className="col7">
            <Option
              label="Add Element To Group"
              Component={SelectInput}
              options={elementGroupsOptions}
              value={interaction.element_group_id}
              onChange={updateInteractionElementGroup}
            />
          </div>
          <div className="col5" >
            <Button primary style={{ marginTop: '25px' }} onClick={toggleGroupModal}>
              <Icon name="plus"/> New
            </Button>
          </div>
        </div>
      ) : null}

      <ElementGroupModal show={showGroupModal} nodeId={parseInt(interaction.node_id)} onClose={toggleGroupModal} />
    </div>
  );
}

NameStep.propTypes = {
  element: PropTypes.object.isRequired,
  updateElement: PropTypes.func.isRequired,
  elementGroups: PropTypes.any.isRequired,
  interaction: PropTypes.object.isRequired,
  updateInteraction: PropTypes.func.isRequired,
  /** If propTypes present the elment group part of step is ommited, defaults to false */
  noGrouping : PropTypes.bool,
};

NameStep.defaultProps = {
  noGrouping : false
}

function ElementGroupModal({ show, onClose, nodeId }) {
  const [elementGroupName, setElementGroupName] = useState(false);

  const dispatch = useDispatch();

  function addNewElementGroup() {
    dispatch(addElementGroup(nodeId, elementGroupName, function addElementGroupCb(){
      onClose && onClose()
    }));
  }

  return (
    <Modal 
      show={show} 
      height={350} 
      onClose={onClose}
      heading={
        <>
          <Icon name="plus" /> Add New Element Group
        </>
      }
      submitButton={
        <Button primary onClick={addNewElementGroup}>
          Create
        </Button>
      }
    > 
      <div className="form-control">
        <Option
          label="Element Group Name"
          value={elementGroupName}
          Component={TextInput}
          onChange={e => {
            setElementGroupName(e.target.value);
          }}
        />
      </div>      
    </Modal>
  );
}
