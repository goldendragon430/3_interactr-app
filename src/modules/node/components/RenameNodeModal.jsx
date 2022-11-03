import React from 'react';
import Icon from 'components/Icon';
import Modal from 'components/Modal';
import Button from 'components/Buttons/Button';

export default class RenameNodeModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {nodeName: props.nodeName};
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.nodeName !== this.state.nodeName) {
      this.setState({nodeName: nextProps.nodeName});
    }
  }

  render(){
    const {editNodeName, updateNodeName, closeModal}= this.props;
    const {nodeName} = this.state;

    return(
      <Modal
        show={editNodeName}
        onClose={()=>closeModal()}
        height={200}
        heading={
          <>
            <Icon name="pen-square" /> Rename Node
          </>
        }
        submitButton={
          <Button primary onClick={()=>updateNodeName(nodeName)}>
            Done
          </Button>
        }
      >
        <div className="form-control">
          <input type="text" value={nodeName} onChange={(e)=>this.setState({nodeName: e.target.value})} />
        </div>
      </Modal>
    )
  }
}