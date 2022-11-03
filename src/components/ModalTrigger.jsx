import React from 'react';

export default class ModalTrigger extends React.Component {
  state = {
    showModal: false
  };

  hideModal = () => {
    this.setState({showModal: false});
  };

  showModal = () => {
    this.setState({showModal: true});
  };

  render() {
    const {children, modal} = this.props;

    return (
      <div>
        {React.cloneElement(children, {onClick: this.showModal})}
        {React.cloneElement(modal, {
          onHide: this.hideModal,
          isOpen: this.state.showModal
        })}
      </div>
    );
  }
}
