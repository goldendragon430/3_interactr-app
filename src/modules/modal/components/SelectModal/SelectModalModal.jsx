import React, {useEffect, useState} from "react";
import Modal from 'components/Modal';
import Button from "../../../../components/Buttons/Button";
import Icon from "../../../../components/Icon";
import {SHOW_SELECT_MODAL_TEMPLATE_MODAL} from "../../../../utils/EventEmitter";
import ReactDOM from "react-dom";
import styles from './SelectModal.module.scss'
import cx from 'classnames'
import {useSetState} from "../../../../utils/hooks";
import SelectModalStepTwo from "./SelectModalStepTwo";
import SelectModalStepOne from "./SelectModalStepOne";
import SelectModalStepThree from "./SelectModalStepThree";

const SelectModalModal = () => {
  const [show, setShow] = useState(false);
  const [onChangeHandler, setOnChangeHandler] = useState(false)
  const [currentModalId, setCurrentModalId] = useState(null);

  const handleShow = ({detail})=>{
    setShow(true);

    const func = ()=>detail.onChange;
    setOnChangeHandler(func);
    setCurrentModalId(detail.currentValue)
  }

  useEffect(()=>{
    window.addEventListener(SHOW_SELECT_MODAL_TEMPLATE_MODAL, (payload)=>handleShow(payload));

    return window.removeEventListener(SHOW_SELECT_MODAL_TEMPLATE_MODAL, handleShow)
  },[])

  if(! show) return null;

  return <Portal setShow={setShow} onChange={onChangeHandler}  currentModalId={currentModalId}/>;
};
export default SelectModalModal;



const Portal = ({setShow, onChange, currentModalId}) => {
  const el  = document.createElement('div');

  useEffect(()=>{
    const container = document.getElementById('modalsRoot');
    container.appendChild(el)
  }, [])

  return ReactDOM.createPortal(
    <SelectModal setShow={setShow} onChange={onChange} currentModalId={currentModalId}/>,
    el
  )
};


const DEFAULT_STATE = {
  activeStep: 1,
  // Either blank template, select from users modals or select template
  context: '',
  modalHeight: 480,
  modalWidth: 885,
  template: null,
  currentModalId: null
}

const SelectModal = ({setShow, onChange, currentModalId}) => {
  // The creation state populated by each step
  const [state, setState] = useSetState({
    ...DEFAULT_STATE,
    ...{
      hideModal: ()=>setShow(false),
      currentModalId
    }
  });

  const handleBack = () => {
    if(state.activeStep===1) {
      setShow(false);
    }
    else if (state.context==='blank') {
      // Back has been pressed on step 3 but in the blank modal
      // context so we skip step 2 and go all the way back to
      // step 1
      setState({
        activeStep: 1,
      })
    }
    else {
      setState({
        activeStep: state.activeStep - 1,
      })
    }
  }

  const {modalHeight, modalWidth} = state;

  return(
    <Modal 
      width={modalWidth} 
      height={modalHeight} 
      show={true} 
      onClose={handleBack}
      heading={
        "Select A Popup"
      }
    >      
      <div className="modal-body h-100">
        <Steps state={state} setState={setState} onChange={onChange} setShow={setShow} />
      </div>
    </Modal>
  )
}


const Steps = ({state, setState, onChange, setShow}) => {
  const {activeStep} = state;

  switch(activeStep){
    case(1) :
      return <SelectModalStepOne setState={setState} state={state} />;
    case(2) :
      return <SelectModalStepTwo setState={setState} state={state} onChange={onChange} setShow={setShow}/>;
    case(3) :
      return <SelectModalStepThree setState={setState}  state={state} onChange={onChange}/>;
  }
};