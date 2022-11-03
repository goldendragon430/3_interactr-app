import React, { useEffect } from 'react';
import ReactModal from 'react-modal';
import Icon from "./Icon";
import Button from "./Buttons/Button";

const Modal = ({
  height = 350,
  width = 480,
  onClose,
  onBack,
  children,
  heading,
  submitButton,
  show,
  enableFooter=true,
  ...props
}) => {

  useEffect(() => {
    ReactModal.setAppElement('#appRoot');
  }, []);
  
  const handleBack = () => {
    // We can override rhe onClose with a onBack
    // when needed, this is good for multiple modal
    // workflows
    if(onBack) {
      onBack();
    }else {
      onClose();
    }
  }

  return(
    <ReactModal
      isOpen={show}
      onRequestClose={onClose}
      closeTimeoutMS={300}
      style={{
        content: {
          width: width, 
          height: height,
        }
      }}
    >
      <div className="modal-heading">
        {heading}
      </div>
      <div className="modal-body">
        {children}
      </div>
      { 
        enableFooter &&  
        <div className="modal-footer text-right">
          <Button onClick={handleBack} left><Icon name={'arrow-left'} /> Back</Button>
          {submitButton}
        </div>
      }
    </ReactModal>
  )
};
export default Modal;