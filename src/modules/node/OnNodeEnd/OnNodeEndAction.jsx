import React from 'react';
import {motion} from "framer-motion";

import ClickableElementProperties from "modules/element/components/Properties/ClickableElementProperties";


export const OnNodeEndAction = ({node, update, tabAnimation}) => {
  const options = {
    '': 'Do nothing',
    playNode:'Play Node',
    openUrl: 'Open Url',
    openModal: 'Open Popup',
    loop: 'Loop Video'
  };

  const { id, completeAction, completeActionArg } = node;

  return(
    <motion.div {...tabAnimation}>
      <ClickableElementProperties
        actionTitle="Action To Take When The Video Ends"
        actionLabel="completeAction"
        actionArgLabel="completeActionArg"
        noHeading={true}
        element={{
          action: completeAction,
          actionArg: completeActionArg,
          id,
          __typename: 'Node'
        }}
        update={update}
        onSave={update}
        className="flex-1"
        options={options}
        wrapperStyle={{
          padding: 0,
        }}
      />
    </motion.div>
  )
};