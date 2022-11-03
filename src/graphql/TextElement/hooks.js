import {TEXT_ELEMENT} from "../../modules/element/elements";
import {useElement} from "../Element/hooks";
import {cache} from "../client";
import mapValues from "lodash/mapValues";

/**
 * Custom hook for the single text element
 * @param id
 * @returns {[{data: any | undefined, networkStatus: NetworkStatus, update: function(*, *): void, refetch: <TVariables>(variables?: OperationVariables) => Promise<ApolloQueryResult<any>>, loading: boolean, error: ApolloError | undefined}, {}]}
 */
export const useTextElement = id => useElement(TEXT_ELEMENT, id);

export const useTextElementCommands = (id= null) => {
  const updateTextElement = (key, value, _id = null) => {
    const elementId = _id || id;
    if(!elementId) {
      console.error("No id passed to updateTextElement")
      return;
    }

    const fields = (typeof key === 'object') ?
      mapValues(key, (k)=>{
        return ()=>{ return k }
      })
      : {[key]: ()=>{return value}}

    const cacheKey = cache.identify({id: elementId, __typename: 'TextElement'});
    cache.modify({
      id: cacheKey,
      fields
    });
  }

  return {updateTextElement}
}