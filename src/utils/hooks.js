import {useEffect, useReducer, useState, useMemo, useRef} from "react";
import analytics from "./analytics";
import { getFromLS, setInLS } from './helpers'
import {setBreadcrumbs} from "../graphql/LocalState/breadcrumb";
import {setPageHeader} from "../graphql/LocalState/pageHeading";

/** Returns the saved value for the item, and an updater for it , all values are stringified
 * @param {string} name name of the item in localstorage
 * @param {*} initVal value to initialize with if no item saved with that name
 * @returns {[("saved"|"initVal"), updateValue]}
 */
export function useLocalStorage(name, initVal) {
  // 👇 useMemo to prevent this from checking on every re-render, 
  // normally we only wanna do this once on initial render
  let value = useMemo(() => getFromLS(name, initVal), []);
  const updater = useMemo(() => (newValue) => setInLS(name, newValue),[])
  return [value, updater];
}

// Implementation of the old this.setState using react hooks
export const useSetState = ( initialState = {} ) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const setState = updatedState => dispatch(updatedState);

  return [state, setState];
};

// Take the previous state and merge with whatever's changed on the new state
const reducer = (previousState = {}, updatedState = {} ) => {
  return {...previousState, ...updatedState};
};


export const useAnalytics = (queries) => {
  const [loading, setLoading] = useState(true);
  const [_data, setData] = useState({});
  const [error, setError] = useState('');

  useEffect(()=>{
    analytics.queries(queries)
      .then(({data})=>{
        setData(data);
      })
      .catch((message)=>{
        setError(message)
      })
      .finally(()=>{
        setLoading(false);
      });
  }, []);

  return [_data, {loading, error} ];
};


// Hook
// https://usehooks.com/useKeyPress/
export const useKeyPress = (targetKey) => {
  // State for keeping track of whether key is pressed
  const [keyPressed, setKeyPressed] = useState(false);

  // If pressed key is our target key then set to true
  function downHandler({ key }) {
    if (key === targetKey) {
      setKeyPressed(true);
    }
  }

  // If released key is our target key then set to false
  const upHandler = ({ key }) => {
    if (key === targetKey) {
      setKeyPressed(false);
    }
  };

  // Add event listeners
  useEffect(() => {
    window.addEventListener('keydown', downHandler);
    window.addEventListener('keyup', upHandler);
    // Remove event listeners on cleanup
    return () => {
      window.removeEventListener('keydown', downHandler);
      window.removeEventListener('keyup', upHandler);
    };
  }, []); // Empty array ensures that effect is only run on mount and unmount

  return keyPressed;
}

// Hook
export function useOnClickOutside(ref, handler) {
  useEffect(
    () => {
      const listener = event => {
        // Do nothing if clicking ref's element or descendent elements
        if (!ref.current || ref.current.contains(event.target)) {
          return;
        }

        handler(event);
      };

      document.addEventListener('mousedown', listener);
      document.addEventListener('touchstart', listener);

      return () => {
        document.removeEventListener('mousedown', listener);
        document.removeEventListener('touchstart', listener);
      };
    },
    // Add ref and handler to effect dependencies
    // It's worth noting that because passed in handler is a new ...
    // ... function on every render that will cause this effect ...
    // ... callback/cleanup to run every render. It's not a big deal ...
    // ... but to optimize you can wrap handler in useCallback before ...
    // ... passing it into this hook.
    [ref, handler]
  );
}

/**
 * custom hook that uses the useRef hook internally for storing the previous value
 * @param value
 * @returns {unknown}
 */
export const usePrevious = value => {
  // The ref object is a generic container whose current property is mutable ...
  // ... and can hold any value, similar to an instance property on a class
  const ref = useRef();

  // Store current value in ref
  useEffect(() => {
    ref.current = value;
  }, [value]); // Only re-run if value changes

  // Return previous value (happens before update in useEffect above)
  return ref.current;
};

export const usePageLoad = (heading, breadcrumb) => {
  useEffect(()=>{
    setBreadcrumbs(breadcrumb);
    setPageHeader(heading);
  }, []);
};