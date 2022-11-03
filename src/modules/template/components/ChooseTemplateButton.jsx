import React from 'react';
import Modal from 'components/Modal';
import Button from 'components/Buttons/Button';
import TemplateList from './TemplateList';
import callsProp from 'decorators/callsProp';
import Icon from 'components/Icon';

export default class ChooseTemplateButton extends React.Component {
  state = {
    showModal: false
  };

  showModal = () => this.setState({showModal: true});
  hideModal = () => this.setState({showModal: false});

  @callsProp('onSelect')
  handleSelectTemplate(id) {
    this.hideModal();
  }

  render() {
    const {table} = this.props;
    return (
      <div>
        <Button onClick={this.showModal}>Choose template</Button>
        <Modal
          width={800}
          height={480}
          show={this.state.showModal}
          onClose={this.hideModal}
          heading={
            <>
              <Icon name="folder-open-o" /> Choose a template
            </>
          }
        >
          {// we render this based on state so componentWillMount gets triggered
          // and templates are refetched
            this.state.showModal && (
              <TemplateList table={table} onSelect={this.handleSelectTemplate} />
          )}
        </Modal>
      </div>
    );
  }
}
