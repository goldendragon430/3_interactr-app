import {HOTSPOT_ELEMENT} from "../../modules/element/elements";
import {useElement} from "../Element/hooks";
import {cache} from "../client";
import {useMutation} from "@apollo/client";
import {UPDATE_HTML_ELEMENT} from "./mutations";
import mapValues from "lodash/mapValues";

/**
 * Custom hook for the custom html element
 * @param id
 * @returns {[{data: any | undefined, networkStatus: NetworkStatus, update: function(*, *): void, refetch: <TVariables>(variables?: OperationVariables) => Promise<ApolloQueryResult<any>>, loading: boolean, error: ApolloError | undefined}, {}]}
 */
export const useCustomHtmlElement = id => useElement(HOTSPOT_ELEMENT, id);

export const useCustomHtmlElementCommands = (id= null) => {
  const updateCustomHtmlElement = (key, value, _id = null) => {
    const elementId = _id || id;
    if(!elementId) {
      console.error("No id passed to updateCustomHtmlElement")
      return;
    }

    // Allows for the func to receive the args
    // as func(key, value) OR
    // func({key:value, key:value})
    // so multiple can be updated at once
    const fields = (typeof key === 'object') ?
      mapValues(key, (k)=>{
        return ()=>{ return k }
      })
      : {[key]: ()=>{return value}}


    const cacheKey = cache.identify({id: elementId, __typename: 'CustomHtmlElement'});
    cache.modify({
      id: cacheKey,
      fields
    });
  }

  const [saveCustomHtmlElement] = useMutation(UPDATE_HTML_ELEMENT);

  return {updateCustomHtmlElement, saveCustomHtmlElement}
}