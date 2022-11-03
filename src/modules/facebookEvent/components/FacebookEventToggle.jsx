import React, {useEffect, useState} from 'react';
import {BooleanInput, LargeTextInput, Option, Section, SelectInput, TextInput} from "../../../components/PropertyEditor";
import Icon from "../../../components/Icon";
import Button from "../../../components/Buttons/Button";
import DisplayEvent from "./DisplayEventAsCode";
import FacebookEventModal from "./FacebookEventModal";
import FacebookEventForm from "./FacebookEventForm";
import PropTypes from 'prop-types';

const _props = {
  // The label used on the toggle
  label: PropTypes.string,
  // Should return a promise so we can manage the loading state
  onChangeShouldSendEvent: PropTypes.func.isRequired,
  // Should return a promise for managing loading state
  onChangeEventId: PropTypes.func.isRequired,
  // Bool that controls the true false value of the toggle
  shouldSendEvent: PropTypes.number.isRequired,
  // The event ID, if none exists the component will create one
  eventId: PropTypes.number.isRequired,
};

const FacebookEventToggle = ({label, onChangeShouldSendEvent, onChangeEventId, shouldSendEvent, eventId}) => {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  return(
    <>
      <Option
        label={label}
        Component={BooleanInput}
        onChange={async (val)=>{
          setLoading(true);
          try {
           await onChangeShouldSendEvent(val);
          }catch(error){
            alert(error)
          }
          setLoading(false);
          if(val) {
            setShowModal(true)
          }
        }}
        value={shouldSendEvent}
        disabled={loading}
      />

      {/* Show when the component is updating the interaction */}
      {!!loading && <Icon loading />}

      {/* Displays the event as read only html with some syntax highlighting */}
      {!loading && !!shouldSendEvent && !! eventId && <>
        <label className={'mt-0'}>Preview</label>
        <DisplayEvent eventId={eventId} />
      </>}

      <div style={{marginBottom: '30px'}} className={'clearfix'}>
        {/* Show the create button, the modal is opened automatically but if they close that we still have a button to reopen it */}
        {!loading && !!shouldSendEvent && ! eventId && <Button small onClick={()=>setShowModal(true)} icon={'plus'}>Create Event</Button>}

        {/* If we have an event ID we show an edit button instead of the create button */}
        {!loading && !!shouldSendEvent && !! eventId && <Button small onClick={()=>setShowModal(true)} icon={'edit'}>Edit Event</Button>}
      </div>

      {/* The edit / create button opens this modal to create/edit the event */}
      <FacebookEventModal
        toggleModal={setShowModal}
        showModal={showModal}
      >
        <FacebookEventForm eventId={eventId} onChangeEventId={onChangeEventId}  toggleModal={setShowModal} />
      </FacebookEventModal>
    </>
  );
};
FacebookEventToggle.prototype = _props;
export default FacebookEventToggle;
