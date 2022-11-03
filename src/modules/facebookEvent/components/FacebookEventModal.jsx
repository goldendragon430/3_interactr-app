import ReactDOM from "react-dom";
import Modal from 'components/Modal';
import Icon from "../../../components/Icon";
import React, {useEffect} from "react";

/**
 * Render the edit modal in a portal so it doesn't sit inside the flyout menu
 * @param show
 * @param toggle
 * @param eventId
 * @param updateInteraction
 * @returns {{children: *, implementation: *, containerInfo: *, $$typeof: number, key: (null|string)}}
 * @constructor
 */
const FacebookEventModal = ({toggleModal, showModal, children}) => {
  if(! showModal) return null;

  const el = document.createElement('div');

  useEffect(()=>{
    const container = document.getElementById('portal-container');
    container.appendChild(el);
  }, []);

  return ReactDOM.createPortal(
    <EventModal toggle={toggleModal} children={children} />,
    el
  );
};
export default FacebookEventModal;

/**
 * Top Level form of the event modal
 * @param eventId
 * @param updateInteraction
 * @param toggle
 * @returns {*}
 * @constructor
 */
const EventModal = ({toggle, children}) => {
  return(
    <Modal
      show={true}
      onClose={()=>toggle(false)}
      height={700}
      width={1000}
      heading={
        <>
          <Icon name={['fab', 'facebook']} /> Facebook Event
        </>
      }
    >
      {children}
    </Modal>
  )
};