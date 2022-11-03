import React from 'react';
import {AnimatePresence, motion} from "framer-motion";

import { BooleanInput, Option, RangeInput } from "components/PropertyEditor";
import {animationState, preAnimationState, transition} from "components/PageBody";

export const OnNodeEndDelay = ({ node, update, tabAnimation }) => {
  const { completeActionTimer, completeActionSound, completeActionDelay } = node;

  return(
    <motion.div {...tabAnimation}>
      <p style={{marginTop: 0}}>Add a delay to when your node end action triggers to give users time to take an action.</p>
      <p>
        Timers can also be used to encourage users to take an action before the timer expires, this can be done with or without a node action.
      </p>
      <Option
        label="Node End Action Delay (Secs)"
        value={completeActionDelay}
        Component={RangeInput}
        min={0}
        max={20}
        step={1}
        onChange={val=>update("completeActionDelay", val)}
      />
      {
        (!!completeActionDelay && completeActionDelay > 0) &&
        <AnimatePresence>
          <motion.div
            exit={preAnimationState}
            initial={preAnimationState}
            animate={animationState}
            transition={transition}>
            <Option
              label="Show A Timer"
              value={completeActionTimer}
              Component={BooleanInput}
              onChange={val=>update("completeActionTimer", val)}
            />
          </motion.div>
        </AnimatePresence>
      }
      {
        (!!completeActionDelay && completeActionDelay > 0 ) &&
        <AnimatePresence>
          <motion.div
            exit={preAnimationState}
            initial={preAnimationState}
            animate={animationState}
            transition={transition}>
            <Option
              label="Play Timer Sound"
              value={completeActionSound}
              Component={BooleanInput}
              onChange={val=>update("completeActionSound", val)}
            />
          </motion.div>
        </AnimatePresence>
      }
    </motion.div>
  )
};