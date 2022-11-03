import React, {useEffect, useState} from 'react';
import ReactDOM from 'react-dom';
import NewDynamicText from "./NewDynamicText";
import {EventListener} from "./EventListener";
import {TOGGLE_INSERT_DYNAMIC_TEXT_MODAL} from "../utils/EventEmitter";

const DynamicText = () => {
  const [show, setShow] = useState(false);
  
  return(
    <>
      <EventListener name={TOGGLE_INSERT_DYNAMIC_TEXT_MODAL} func={()=>setShow(true)}>
        {!!show && <NewDynamicTextPortal setShow={setShow} />}
      </EventListener>
    </>
  );
};
export default DynamicText;

const NewDynamicTextPortal = ({setShow}) => {
  const el = document.createElement('div');
  el.setAttribute('class', 'dynamic-text');

  useEffect(()=>{
      const container = document.getElementById('modalsRoot');
      container.appendChild(el); 
  }, [el]);

  return ReactDOM.createPortal(
    <NewDynamicText setShow={setShow} />,
    el
  );
};