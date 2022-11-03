import React from 'react';
import ErrorMessage from "../../../components/ErrorMessage";
import FacebookEventToggle from "../../facebookEvent/components/FacebookEventToggle";

const ElementFacebookToggle = ({toggleKey, idKey, element, save, updateContext, error, label}) => {
  // Need to rethink this due to iOS14 updates
  return null;

  if(error){
    return <ErrorMessage error={error} />
  }

  const facebookEventId = element[idKey];
  const toggleValue = element[toggleKey];

  return(
    <FacebookEventToggle
      label={label || "Send Event to Facebook When This Element is Clicked"}
      onChangeShouldSendEvent={ async (val) =>{
        // See notes at top of page as to why we do this
        updateContext(toggleKey, val);
        return save({
          id: element.id,
          [toggleKey]: val
        })
      }}
      onChangeEventId={ async (val) =>{
        // See notes at top of page as to why we do this
        updateContext(idKey, val);
        return save({
          id: element.id,
          [idKey]: val
        })
      }}
      shouldSendEvent={toggleValue}
      eventId={facebookEventId}
    />
  );
};
export default ElementFacebookToggle;