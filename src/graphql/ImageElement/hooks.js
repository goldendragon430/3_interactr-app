import {IMAGE_ELEMENT} from "../../modules/element/elements";
import {useElement} from "../Element/hooks";
import {createMutationHook} from "../utils";
import {UPDATE_IMAGE_ELEMENT} from "./mutations";
import {cache} from "../client";
import mapValues from "lodash/mapValues";
import {useMutation} from "@apollo/client";

/**
 * Custom hook for the image element
 * @param id
 * @returns {[{data: any | undefined, networkStatus: NetworkStatus, update: function(*, *): void, refetch: <TVariables>(variables?: OperationVariables) => Promise<ApolloQueryResult<any>>, loading: boolean, error: ApolloError | undefined}, {}]}
 */
export const useImageElement = id => useElement(IMAGE_ELEMENT, id);

export const useSaveImageElement = (id, options) => createMutationHook({
  mutation: UPDATE_IMAGE_ELEMENT,
  options
});

export const useImageElementCommands = (id= null) => {
  const updateImageElement = (key, value, _id = null) => {
    const elementId = _id || id;
    if(!elementId) {
      console.error("No id passed to updateImageElement")
      return;
    }

    const fields = (typeof key === 'object') ?
      mapValues(key, (k)=>{
        return ()=>{ return k }
      })
      : {[key]: ()=>{return value}}

    const cacheKey = cache.identify({id: elementId, __typename: 'ImageElement'});
    cache.modify({
      id: cacheKey,
      fields
    });
  }

  const [saveImageElement] = useMutation(UPDATE_IMAGE_ELEMENT);

  return {updateImageElement, saveImageElement}
}