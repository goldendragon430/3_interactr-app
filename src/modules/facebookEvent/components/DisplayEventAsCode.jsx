import React, {useEffect, useState} from 'react';
import SyntaxHighlighter from "react-syntax-highlighter";
import {docco} from "react-syntax-highlighter/dist/cjs/styles/hljs";
import PropTypes from "prop-types";
import Button from "../../../components/Buttons/Button";
import {useFacebookEvent} from "../../../graphql/FacebookEvent/hooks";
import Icon from "../../../components/Icon";
import ErrorMessage from "../../../components/ErrorMessage";

const _props = {
  // The Facebook event object, can be an object from the
  // database or just from local state if creating a new object
  FacebookEvent: PropTypes.object,
  // As an alternate we can pass in the event ID and get the
  // event manually
  eventId: PropTypes.number
};

/**
 * Display the event code (if exists) with a create or edit button
 * to update the event
 * @param eventId
 * @param openModal
 * @returns {*}
 * @constructor
 */
const DisplayEvent = ({eventId, facebookEvent}) => {
  if(eventId) {
    return <GetAndDisplayEventCode eventId={eventId} />
  }

  return <DisplayEventCode FacebookEvent={facebookEvent}/>
};
DisplayEvent.prototype = _props;
export default DisplayEvent;

/**
 * Dispaly the facebook event as code
 * @param event
 * @returns {*}
 * @constructor
 */
const DisplayEventCode = ({FacebookEvent}) => {
  if(!FacebookEvent) return null;

  const {event_type, event_name, meta_data} = FacebookEvent;

  let string = `fbq({`;

  if(event_type==='trackCustom') {
    string += `
    'trackCustom',
    '${event_name}'`;
  }
  else {
    string += `
    'track',
    '${event_type}'`;
  }

  if(meta_data){
    string += `, 
    ${meta_data}`;
  }
  string += `
})`;

  return(
    <div>
      <SyntaxHighlighter language="javascript" style={docco}>
        {string}
      </SyntaxHighlighter>
    </div>
  )
};


const GetAndDisplayEventCode = ({eventId}) => {
  const [FacebookEvent, _, {loading, error}] = useFacebookEvent(eventId);

  if(loading) return <Icon loading />

  if(error) return <ErrorMessage error={error} />

  return <DisplayEventCode FacebookEvent={FacebookEvent} />;
};
