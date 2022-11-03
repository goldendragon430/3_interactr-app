import {CREATE_ELEMENT_GROUP, DELETE_ELEMENT_GROUP, UPDATE_ELEMENT_GROUP} from "./mutations";
import {gql, useMutation} from "@apollo/client";
import {cache} from "../client";
import {useParams} from 'react-router-dom'
import mapValues from "lodash/mapValues";
import {GET_ELEMENT_GROUPS} from "./queries";

export const useElementGroupCommands = (id = null) => {
  const {nodeId} = useParams();

  /**
   * Update element group in the cache
   * @param key
   * @param value
   * @param _id
   * @returns {*}
   */
  const updateElementGroup = (key, value, _id) => {
    const elementGroupId = _id || id;
    if(! elementGroupId){
      console.error("No ID passed to updateElementGroup")
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

    const cacheKey = cache.identify({id: elementGroupId, __typename: 'ElementGroup'});
    cache.modify({
      id: cacheKey,
      fields
    });
  };

  /**
   * Create a new Element Group
   */
  const [createElementGroup] = useMutation(CREATE_ELEMENT_GROUP, {
    update: (cache, { data: { createElementGroup } }) => {
    //   // Push new element group to the node element groups list
      const nodeKey = cache.identify({
        id: createElementGroup.node_id,
        __typename: 'Node'
      });

      cache.modify({
        id: nodeKey,
        fields: {
          element_groups(currentElementGroups){
            return [...currentElementGroups, {
              __ref: 'ElementGroup:' + createElementGroup.id
            }]
          }
        }
      });
    }
  });

  /**
   * Delete an element group
   */
  const [deleteElementGroup] = useMutation(DELETE_ELEMENT_GROUP, {
    update: (cache, {data} )=>{
      // Remove the interaction from the cache
      const {id} = data.deleteElementGroup;
      const key = cache.identify({
        id, __typename: 'ElementGroup'
      })
      cache.evict({ id: key})
    }
  });

  /**
   * Save element group in the BE
   */
  const [saveElementGroup] = useMutation(UPDATE_ELEMENT_GROUP);

  return {updateElementGroup, createElementGroup, deleteElementGroup, saveElementGroup}
};