/** Gets value from localStorage and returns initVal otherwise */
import getAsset from "./getAsset";
import mapValues from "lodash/mapValues";
import moment from "moment";

export function getFromLS(name, initVal) {
  let saved = window.localStorage.getItem(name);
  try {
    return saved ? JSON.parse(saved) : initVal;
  } catch (error) {
    // also set it to initVal if it couldn't correctly parse
    console.warn('failed to parse value from LS\n', saved);
    return initVal;
  }
}

/** takes any valid js object or primitive , stringifies it and saves it into LS */
export function setInLS(name, newVal) {
  try {
    window.localStorage.setItem(name, JSON.stringify(newVal));
  } catch (error) {
    // do nothing
    console.warn('Failed stringifying item\n', newVal);
  }
}

export const notUndefined = (val) => {
  return typeof val !== 'undefined';
};

export const hexToRgb = (hex) => {
  // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
  var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, function (m, r, g, b) {
    return r + r + g + g + b + b;
  });

  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
};

/** deepCopies an object
 * @param obj
 */
export function deepCopy(obj) {
  // copy object , if prop is object deep copy prop as well
  const newObj = {};
  Object.keys(obj).forEach((prop) => {
    const propVal = obj[prop];
    if (typeof propVal == 'object' && propVal !== null) {
      newObj[prop] = deepCopy(propVal);
    } else {
      newObj[prop] = propVal;
    }
  });
  return newObj;
}

/**
 * Get extension from given
 *
 * get_url_extension('https://example.com/folder/file.jpg');
 * get_url_extension('https://example.com/fold.er/fil.e.jpg?param.eter#hash=12.345');
 *
 * Outputs for both: --> jpg
 *
 * @param url
 * @returns {string|*}
 */
export function getUrlExtension(url) {
  return url.split(/[#?]/)[0].split('.').pop().trim();
}

export function openInNewTab(url) {
  var win = window.open(url, '_blank');
  win.focus();
}

export function avatar(user){
  if(user && user?.avatar_url) return user.avatar_url;

  return getAsset('/img/avatar-logo.png');
}

const delay = ms => new Promise(res => setTimeout(res, ms));

// Allows for the func to receive the args
// as func(key, value) OR
// func({key:value, key:value})
// so multiple can be updated at once
export function getFields(key, value) {
  if(typeof key === 'object') {
    return mapValues(key, (k)=>{
      return ()=>{ return k }
    });
  }
  return {[key]: ()=>{return value}};
}

/**
 * Get the last 12 months from the current date
 * 
 * @returns array
 */
export const getPastTwelveMonths = () => {
  const months = [];
  const startDate = moment();
  const endDate = moment().subtract(12, 'months');
  while (endDate.diff(startDate, 'months')) {
    months.unshift(startDate.format('MMM YY'));
    startDate.subtract(1, 'month');
  }
  return months;
}