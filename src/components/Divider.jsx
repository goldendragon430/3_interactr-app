import React from 'react';

/**
 * Divider component used on the share page to seperate the different sections
 * with a gradient line
 * @param text
 * @returns {*}
 * @constructor
 */
export const Divider = ({text})=>{
  return(
    <div className="divider">
      <span>&nbsp;</span><span>
      <h4>{text}</h4>
      </span><span>&nbsp;</span>
    </div>
  );
};