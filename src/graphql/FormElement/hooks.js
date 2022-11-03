import {FORM_ELEMENT} from "../../modules/element/elements";
import {useElement} from "../Element/hooks";
import {createMutationHook} from "../utils";
import {UPDATE_FORM_ELEMENT} from "./mutations";
import {cache} from "../client";
import  mapValues from "lodash/mapValues";

/**
 * Custom hook for the form element
 * @param id
 * @returns {[{data: any | undefined, networkStatus: NetworkStatus, update: function(*, *): void, refetch: <TVariables>(variables?: OperationVariables) => Promise<ApolloQueryResult<any>>, loading: boolean, error: ApolloError | undefined}, {}]}
 */
export const useFormElement = id => useElement(FORM_ELEMENT, id);

export const useSaveFormElement = (id, options) => createMutationHook({
  mutation:UPDATE_FORM_ELEMENT,
  options
});

export const useFormElementCommands = (id = null) => {
  const updateFormElement = (key, value, _id = null) => {
    const elementId = _id || id;
    if(!elementId) {
      console.error("No id passed to updateFormElement")
      return;
    }

    const fields = (typeof key === 'object') ?
      mapValues(key, (k)=>{
        return ()=>{ return k }
      })
      : {[key]: ()=>{return value}}

    const cacheKey = cache.identify({id: elementId, __typename: 'FormElement'});

    cache.modify({
      id: cacheKey,
      fields
    });
  }

  return {updateFormElement}
}