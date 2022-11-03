import {HOTSPOT_ELEMENT} from "../../modules/element/elements";
import {useElement} from "../Element/hooks";
import {createMutationHook} from "../utils";
import {UPDATE_HOTSPOT_ELEMENT} from "./mutations";
import {cache} from "../client";
import {useMutation} from "@apollo/client";
import mapValues from "lodash/mapValues";

/**
 * Custom hook for the hotspot element
 * @param id
 * @returns {[{data: any | undefined, networkStatus: NetworkStatus, update: function(*, *): void, refetch: <TVariables>(variables?: OperationVariables) => Promise<ApolloQueryResult<any>>, loading: boolean, error: ApolloError | undefined}, {}]}
 */

export const useHotspotElement = id => useElement(HOTSPOT_ELEMENT, id);

export const useSaveHotspotElement = (id, options) => createMutationHook({
  mutation:UPDATE_HOTSPOT_ELEMENT,
  options
});

export const useHotspotElementCommands = (id= null) => {
  const updateHotspotElement = (key, value, _id = null) => {
    const elementId = _id || id;
    if(!elementId) {
      console.error("No id passed to updateHotspotElement")
      return;
    }


    const fields = (typeof key === 'object') ?
      mapValues(key, (k)=>{
        return ()=>{ return k }
      })
      : {[key]: ()=>{return value}}

    const cacheKey = cache.identify({id: elementId, __typename: 'HotspotElement'});
    cache.modify({
      id: cacheKey,
      fields
    });
  }

  const [saveHotspotElement] = useMutation(UPDATE_HOTSPOT_ELEMENT);

  return {updateHotspotElement, saveHotspotElement}
}