import React, {useRef, useEffect} from 'react';
import Emitter from "../utils/EventEmitter";

/**
 * Subscribe and unsubscribe to an event on
 * component mount and unmount
 * @param name
 * @param func
 * @param children
 * @returns {*}
 * @constructor
 */
export const EventListener = ({name, func, children}) => {
  useEffect(()=>{
    // Subscribe to the play head scrub event on mount
    Emitter.on(name, func);

    // Unsunscribe on unmount
    return ()=>{
      Emitter.off(name);
    };
  }, []);

  return children;
};