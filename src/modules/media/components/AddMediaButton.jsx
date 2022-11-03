import React from 'react';
import Button from 'components/Buttons/Button';
import ModalTrigger from 'components/ModalTrigger';
import AddMediaModal from './AddMediaModals';

// TODO: Not currently used
export default class AddMediaButton extends React.Component {
  render() {
    return (
      <ModalTrigger modal={<AddMediaModal />}>
        <Button>Add Media</Button>
      </ModalTrigger>
    );
  }
}
