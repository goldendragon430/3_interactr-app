import {useElement} from "../Element/hooks";
import {TRIGGER_ELEMENT} from "../../modules/element/elements";
import {cache} from "../client";
import mapValues from 'lodash/mapValues';

/**
 * Custom hook for the trigger element
 * @param id
 * @returns {[{data: any | undefined, networkStatus: NetworkStatus, update: function(*, *): void, refetch: <TVariables>(variables?: OperationVariables) => Promise<ApolloQueryResult<any>>, loading: boolean, error: ApolloError | undefined}, {}]}
 */
export const useTriggerElement = id => useElement(TRIGGER_ELEMENT, id);

export const useTriggerElementCommands = (id= null) => {
  const updateTriggerElement = (key, value, _id = null) => {
    const elementId = _id || id;
    if(!elementId) {
      console.error("No id passed to updateTriggerElement")
      return;
    }
    const fields = (typeof key === 'object') ?
    mapValues(key, (k)=>{
      return ()=>{ return k }
    })
    : {[key]: ()=>{return value}}
    
    const cacheKey = cache.identify({id: elementId, __typename: 'TriggerElement'});
    cache.modify({
      id: cacheKey,
      fields
    });
  }

  return {updateTriggerElement}
}