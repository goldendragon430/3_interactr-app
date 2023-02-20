import {useElement} from "../Element/hooks";
import {BUTTON_ELEMENT} from "../../modules/element/elements";
import {UPDATE_BUTTON_ELEMENT} from "./mutations";
import {createMutationHook} from "../utils";
import {cache} from "../client";
import {useMutation} from "@apollo/client";
import mapValues from 'lodash/mapValues';
import client from "../client";
import {BUTTON_ELEMENT_FRAGMENT} from "./fragments";
import gql from "graphql-tag";


/**
 * Custom hook for button elements
 * @param id
 * @returns {[{data: any | undefined, networkStatus: NetworkStatus, update: function(*, *): void, refetch: <TVariables>(variables?: OperationVariables) => Promise<ApolloQueryResult<any>>, loading: boolean, error: ApolloError | undefined}, {}]}
 */
export const useButtonElement = id => useElement(BUTTON_ELEMENT, id);

export const useSaveButtonElement = (id, options) => createMutationHook({
  mutation:UPDATE_BUTTON_ELEMENT,
  options
});

export const useButtonElementCommands = (id = null) => {
  const updateButtonElement = (key, value, _id = null) => {
    const elementId = _id || id;
    if(!elementId) {
      console.error("No id passed to updateButtonElement")
      return;
    }
    
    const fields = (typeof key === 'object') ?
      mapValues(key, (k)=>{
        return ()=>{ return k }
      })
      : {[key]: ()=>{return value}}

    const cacheKey = cache.identify({id: elementId, __typename: 'ButtonElement'});
    cache.modify({
      id: cacheKey,
      fields
    });
  }

  const [saveMutation] = useMutation(UPDATE_BUTTON_ELEMENT);
  const saveButtonElement = (data) => {
    const elementId = data.id || id;
    if(!elementId) {
      console.error("No id passed to updateButtonElement")
      return;
    }

    const buttonElement = client.readFragment({
      id: 'ButtonElement:'+elementId,
      fragment: gql`${BUTTON_ELEMENT_FRAGMENT}`
    })

    const newElement  = {...buttonElement, ...data.variables.input};

    const {__typename, created_at, ...rest} = newElement

    return saveMutation({
      variables: {
        input: rest
      }
    })
  }


  return {updateButtonElement, saveButtonElement}
};