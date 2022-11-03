import map from "lodash/map";
import client from "../client";
import gql from "graphql-tag";
import {NODE_FRAGMENT} from "./fragments";
import {cache} from "../client";
import mapValues from "lodash/mapValues";
import forEach from "lodash/forEach";

/**
 * API requires a structure to nested mutations that includes an update prop
 * so we need to format the node objects children
 * @returns {{interactions: *}}
 * @param id
 * @param newData // Any new data to push to the  node we're saivng
 */
export const getNodeForSaving = (id, newData) => {
  // Allows us to push a new object to the cache BEFORE we do the save
  if(newData){
    const updateEntity = (data) => {
      const {__typename: type, id, ...restOfNewData} = data;

      const cacheKey = cache.identify({id: id, __typename: type});
      cache.modify({
        id: cacheKey,
        fields:  mapValues(restOfNewData, (k)=>{
          return ()=>{ return k }
        })
      });
    }

    // Allows update not only single items, but also multiple instances through
    if (Array.isArray(newData)) {
      forEach(newData, updateEntity);
    } else {
      updateEntity(newData)
    }
  }


  // IMPORT all relations need to be striped out here as for them to update
  // it would need a nested mutation
  const { node } = client.readQuery({
    query: gql`
        query node($id: ID!) {
            node(id: $id) {
                ...NodeFragment
            }
        }
        ${NODE_FRAGMENT}
    `,
    variables: {id}
  });

  let {media, interactions, project_id, element_groups, __typename, ...restOfNode} = node;

  // Create the nested mutation for the interactions, gets a little messy with the polymorphic relation to an element
  interactions = {
    update: map(interactions, _interaction => {
      // Break off the element as we need to restructure that to a nested mutation we also remove the items from the element
      // here that we don;t want to post back to BE for saving
      let {__typename, zIndex, element : {__typename: elTypename, created_at, ...restOfElement }, ...interaction} = _interaction;

      // Just a simple test to check it works
      //restOfElement.name = 'Test 1';

      // Here we create a new property on the interaction with the typename of the element. This changes interaction.element
      // to interaction.ButtonElement for example. This is needed to handle polymorpihc relations in graphQL as the return type
      // must be the same for mutations (for now at least)
      return {
        ...interaction,
        [elTypename]: {
          // Add the nested mutation to the element type
          update: restOfElement
        },
      };
    })
  };


  element_groups = {
    update: map(element_groups, element_group => {
      // Remove any fields here that can't be passed to the update input
      const {__typename, node_id, ...rest}  = element_group;
      return rest;
    })
  }

  return {interactions, element_groups, ...restOfNode};
};