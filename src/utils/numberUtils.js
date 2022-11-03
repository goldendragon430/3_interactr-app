/** Returns either the value or the relevant bound
 * @param {number} min
 * @param {number} max
 * @param {number} val
 */

import isNaN from "lodash/isNaN";
import isNull from 'lodash/isNull'

export function keepInBounds(min, max, val) {
  return Math.max(Math.min(val, max), min);
}

// https://stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript
export function numberWithCommas(x) {
  if(! isValidNumber(x) ) return 0;
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function percentage(partialValue, totalValue) {
  if(typeof partialValue === 'undefined' || typeof totalValue === 'undefined') return 0;

  return ( (100 * parseInt(partialValue) ) / parseInt(totalValue) ).toFixed(2);
}

export function isValidNumber(number){
  if(
    typeof number === 'undefined' ||
    isNull(number) ||
    isNaN(number) ||
    number === 'NaN'
  ) return false;

  return true;
}