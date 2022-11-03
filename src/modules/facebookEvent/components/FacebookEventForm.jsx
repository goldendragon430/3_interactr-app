import {useSetState} from "../../../utils/hooks";
import {useCreateFacebookEvent, useFacebookEvent, useSaveFacebookEvent} from "../../../graphql/FacebookEvent/hooks";
import Button from "../../../components/Buttons/Button";
import {LargeTextInput, Option, SelectInput, TextInput} from "../../../components/PropertyEditor";
import Icon from "../../../components/Icon";
import ErrorMessage from "../../../components/ErrorMessage";
import React from "react";
import {DefaultMetaData, FacebookPixelEvents} from "../utils";
import DisplayEventAsCode from "./DisplayEventAsCode";

/**
 * Wraps the form and injects either the current event
 * or a new event from state
 * @param value
 * @param onChange
 * @returns {*}
 * @constructor
 */
const FacebookEventForm = ({eventId, onChangeEventId, toggleModal}) => {
  if(eventId) {
    return <EditFacebookEventForm id={eventId} toggleModal={toggleModal}/>
  }
  return <CreateFacebookEventForm onChangeEventId={onChangeEventId} toggleModal={toggleModal}/>
};
export default FacebookEventForm;

const EditFacebookEventForm = ({id, toggleModal}) => {
  const [FacebookEvent, update, {loading, error}] = useFacebookEvent(id);
  const [saveFacebookEvent, {loading: saving, error: savingError}] = useSaveFacebookEvent(id);

  if(loading) return <Icon loading />

  if(error) return <ErrorMessage error={error} />

  const onSubmit = async () => {
    try {
      const req = await saveFacebookEvent(FacebookEvent);
      toggleModal(false);
    }catch(err) {
      console.error(err);
    }
  };

  return <Form event={FacebookEvent} update={update} onSubmit={onSubmit} loading={saving}/>
};


/**
 * Use local state to store the values then pass create new
 * as the onSubmit event
 * @returns {*}
 * @constructor
 */
const CreateFacebookEventForm = ({onChangeEventId, toggleModal}) => {
  const [state, setState] = useSetState({
    event_type: 'trackCustom',
    event_name: 'my_new_Event',
    meta_data: ''
  });

  const [createFacebookEvent, {loading, error}] = useCreateFacebookEvent();

  const update = (key, value) => {
    setState({ [key]: value});
  };

  const onSubmit = async () => {
    try {
      const req = await createFacebookEvent(state);
      // Add the new facebook event ID to the parent model
      onChangeEventId( parseInt(req.data.createFacebookEvent.id) );
      toggleModal(false);

    }catch(err){
      console.error(err)
    }
  };

  return <Form event={state} update={update} onSubmit={onSubmit} loading={loading}/>
};

/**
 * Mananage the editing of the form.
 * @param event
 * @param update
 * @param onSubmit
 * @param loading
 * @returns {null|*}
 * @constructor
 */
const Form = ({event, update, onSubmit, loading}) => {
  const {event_name, event_type, meta_data} = event;

  return(
    <EventFormWrapper loading={loading} onSubmit={onSubmit}>
      <div className={'grid'}>
        <div className={'col12'}>
          <Option
            label="Event Type"
            value={event_type}
            onChange={val=>{
              update("event_type", val);
              // If the event type has some default data populate the meta data
              if(DefaultMetaData[val]){
                update("meta_data", DefaultMetaData[val])
              } else {
                update("meta_data", "")
              }
            }}
            Component={SelectInput}
            options={FacebookPixelEvents}
          />
        </div>

        {(event_type==='trackCustom') &&
        <div className={'col12'}>
          <Option
            label="Event Name"
            value={event_name}
            Component={TextInput}
            onChange={val=>update("event_name", val)}
          />
        </div>}

        <div className={'col12'}>
          <Option
            label="Meta Data"
            value={meta_data}
            Component={LargeTextInput}
            multiline
            onChange={val=>update("meta_data", val)}
          />
        </div>

        <div className={'col12'}>
          <label className={'mt-0'}>Preview</label>
          <DisplayEventAsCode facebookEvent={event}/>
        </div>
      </div>
    </EventFormWrapper>
  )
};

const EventFormWrapper = ({children, loading, onSubmit}) => {
  return(
    <>
      <div className="modal-body">
        <div className={'grid'}>
          <div className={'col6 mt-1'} >
            {children}
          </div>
          <div className={'col6'}>
            <h4 className={'text-center capitalize mt-1'}>How to create audiences from facebook events</h4>
          </div>
        </div>
      </div>

      <div className="modal-footer">
        <Button primary  icon="save" loading={loading} onClick={onSubmit}>
          Save
        </Button>
      </div>
    </>
  )
};