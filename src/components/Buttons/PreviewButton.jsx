import React, { useState } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import Button from './Button';
import styles from './Button.module.scss';
import Modal from 'components/Modal';
import Icon from 'components/Icon';

const propTypes = {
  /** Buton component to render the preview button */
  // Button: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
  /** Button icon color */
  color: PropTypes.string,
  /** Title of the modal to show */
  previewTitle: PropTypes.string.isRequired,
  /** Content of the modal  */
  previewContent: PropTypes.oneOfType([PropTypes.element, PropTypes.func]).isRequired,
  // primary: PropTypes.bool,
  // secondary: PropTypes.bool,
};

function PreviewButton({  previewContent, previewTitle, color, children, ...props }) {
  const [showModal, toggleModal] = useState(false);

  if (!previewContent) throw 'The PreviewButton component is missing the preview content';

  const togglePreview = newState => () => toggleModal(newState);


  return (
    <React.Fragment>
      {children ? (
          <Button {...props}  onClick={togglePreview(true)} right>
            <Icon icon={['fas', 'play-circle']}/>{children}
          </Button>
      ) : (
          <Icon
              icon={['fas', 'play']}
              // transform="shrink-12"
              color={color || 'white'}
              // mask={['fas', 'circle']}
              size="3x"
              onClick={togglePreview(true)}
          />
      )}


      <Modal 
        width={750} 
        height={590} 
        show={showModal} 
        onClose={togglePreview(false)}
        heading={
          <>
            <Icon name="eye" />
            {previewTitle}
          </>
        }
      >
        {showModal && previewContent}
      </Modal>
    </React.Fragment>
  );
}
PreviewButton.defaultProps = {};

PreviewButton.propTypes = propTypes;

export default PreviewButton;
