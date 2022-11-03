import {useNavigate, useParams, generatePath} from "react-router-dom";
import forEach from 'lodash/forEach';

/**
 *
 * @returns {{setQuerys: setQuerys, setParams: setParams}}
 */
export const useUrl = () => {
  // Use react router hook to get all the params
  const allParams = useParams();

  // Custom function to get all the query keys
  const allQuerys = getAllUrlParams();

  // We need to pass in a route builder method here
  // for react router to be able to match params
  // correctly. So the usage of this func would
  // be setParams(projectPath, {projectId: 1})
  const setParams = (builder, params) => {
    const path = builder(params);

    const navigate = useNavigate();

    navigate(path);
  };


  // Set a query value in the URL
  const setQuerys = (object) => {
    const navigate = useNavigate();

    const params = new URLSearchParams();

    forEach(object, (value, key) => {
      params.append(key,value);
    });

    navigate({search: params.toString()})
  }

  // Helper method makes it easier to go back
  const goBack = () => {
    const navigate = useNavigate();

    return history.goBack();
  };

  // Go Forward
  const goForward = () => {
    const navigate = useNavigate();

    return history.goForward();
  }

  // Push new route to the history object
  const goTo = (route) => {
    const navigate = useNavigate();

    return navigate(route);
  }

  return {
    // Getters
    ...allParams, ...allQuerys,
    // Setters
    setParams, setQuerys,
    // Helpers
    goBack, goForward, goTo
  }
}

// https://www.sitepoint.com/get-url-parameters-with-javascript/
function getAllUrlParams() {
  const url = window.location.search;

  // get query string from url (optional) or window
  var queryString = url ? url.split('?')[1] : window.location.search.slice(1);

  // we'll store the parameters here
  var obj = {};

  // if query string exists
  if (queryString) {

    // stuff after # is not part of query string, so get rid of it
    queryString = queryString.split('#')[0];

    // split our query string into its component parts
    var arr = queryString.split('&');

    for (var i = 0; i < arr.length; i++) {
      // separate the keys and the values
      var a = arr[i].split('=');

      // set parameter name and value (use 'true' if empty)
      var paramName = a[0];
      var paramValue = typeof (a[1]) === 'undefined' ? true : a[1];

      // (optional) keep case consistent
      paramName = paramName.toLowerCase();
      if (typeof paramValue === 'string') paramValue = paramValue.toLowerCase();

      // if the paramName ends with square brackets, e.g. colors[] or colors[2]
      if (paramName.match(/\[(\d+)?\]$/)) {

        // create key if it doesn't exist
        var key = paramName.replace(/\[(\d+)?\]/, '');
        if (!obj[key]) obj[key] = [];

        // if it's an indexed array e.g. colors[2]
        if (paramName.match(/\[\d+\]$/)) {
          // get the index value and add the entry at the appropriate position
          var index = /\[(\d+)\]/.exec(paramName)[1];
          obj[key][index] = paramValue;
        } else {
          // otherwise add the value to the end of the array
          obj[key].push(paramValue);
        }
      } else {
        // we're dealing with a string
        if (!obj[paramName]) {
          // if it doesn't exist, create property
          obj[paramName] = paramValue;
        } else if (obj[paramName] && typeof obj[paramName] === 'string'){
          // if property does exist and it's a string, convert it to an array
          obj[paramName] = [obj[paramName]];
          obj[paramName].push(paramValue);
        } else {
          // otherwise add the property
          obj[paramName].push(paramValue);
        }
      }
    }
  }

  return obj;
}