import React, {useState} from 'react';
import Button from 'components/Buttons/Button';
import Emitter, {NODE_PAGE_SAVE_COMPLETE, SAVE_NODE_PAGE} from "../../utils/EventEmitter";
import {EventListener} from "../EventListener";

const SaveButton = () => {
  // Use a local state to show a loader on the button as the toaster is in the bottom left
  // and can be quite far away from the button
  const [saving, setSaving] = useState(false);

  const ClickHandler = async () => {
    //setSaving(true)
    const event = new CustomEvent(SAVE_NODE_PAGE)
    window.dispatchEvent(event);
  };

  return(
    <>
      <EventListener name={NODE_PAGE_SAVE_COMPLETE} func={()=>setSaving(false)}>
        <Button
          icon="save"
          text="Save Changes"
          style={{ marginBottom: 0, marginRight: 0}}
          loading={saving}
          onClick={ClickHandler}
        />
      </EventListener>
    </>
  )
};
export default SaveButton;


