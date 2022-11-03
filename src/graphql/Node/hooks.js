import { createQueryHook, createLocalHook, createMutationHook, deleteItem, addItem } from '../utils';
import {cache} from "../client";
import {COPY_NODE, CREATE_NODE, DELETE_NODE, SORT_NODES_COLLECTION, UPDATE_NODE} from './mutations';
import {MEDIA_FRAGMENT} from "../Media/fragments";
import gql from "graphql-tag";
import client from "../client";
import {useMutation} from "@apollo/client";
import {GET_NODE} from "./queries";
import mapValues from "lodash/mapValues";
import remove from 'lodash/remove'


export const useNodeCommands = (id = null) => {
  const [saveNode] = useMutation(UPDATE_NODE);

  /**
   * Update a node in the
   * apollo cache
   * @param key
   * @param value
   */
  const updateNode = (key,value, _id = null)  => {
    const nodeId = _id || id;
    if(! nodeId) {
      console.error("no ID passed to updateNode function")
      return;
    }

    const fields = (typeof key === 'object') ?
      mapValues(key, (k)=>{
        return ()=>{ return k }
      })
      : {[key]: ()=>{return value}}

    const cacheKey = cache.identify({id: nodeId, __typename: 'Node'});
    cache.modify({
      id: cacheKey,
      fields
    });

    // If we're updating the media_id we also need to replace the media item in the relationship
    if(key==='media_id' || key.media_id){

      // Need to account for  the input update being a object
      const val = (key==='media_id' ) ? value : key.media_id;
      const media = client.readFragment({
        id: cache.identify({id: val, __typename: "Media"}),
        fragment: gql`${MEDIA_FRAGMENT}`
      })
      cache.modify({
        id: cacheKey,
        fields: {
          media(){ return media }
        }
      });
    }
  };


  const [deleteNode] = useMutation(DELETE_NODE, {
    update(cache, {data: {deleteNode}}){

      const projectKey = cache.identify({
        id: deleteNode.project.id,
        __typename: 'Project'
      })

      // Now we need to remove the node from the project.nodes array
      cache.modify({
        id: projectKey,
        fields:{
          nodes(currentNodes){
            return currentNodes.filter( node => node.__ref !== `Node:${deleteNode.id}`);
          }
        }
      })
    }
  });

  const [createNode] = useMutation(CREATE_NODE, {
    update(cache, { data: { createNode } }) {
      cache.modify({
        id: cache.identify({
          id: createNode.project_id,
          __typename: 'Project'
        }),
        fields: { nodes: (prevNodes) => [...prevNodes, { __ref: `Node:${createNode.id}` }] },
      });
    },
  });

  const [copyNode] = useMutation(COPY_NODE, {
    update(cache, {data: {copyNode}}) {
      // Push the new node to the project nodes list
      const projectKey = cache.identify({
        id: copyNode.project_id,
        __typename: 'Project'
      });
      cache.modify({
        id: projectKey,
        fields: {
          nodes(currentNodes){
            return [...currentNodes, {
              __ref: 'Node:' + copyNode.id
            }]
          }
        }
      });
    }
  });

  return {
    updateNode,
    saveNode,
    deleteNode,
    createNode,
    copyNode
  }
}

export const useNode = (id = null) => {
  const { nodeId : idFromRoute } = useParams()
  id = id || idFromRoute ;
  return createQueryHook({
    typename: 'Node',
    query: GET_NODE,
    variables: { nodeId: parseInt(id) },
  });
};


export const useCreateNode = (options = {}) => createMutationHook({ mutation: CREATE_NODE, options});

export const useSaveNode = (options = {}) => createMutationHook({ mutation: UPDATE_NODE, options });

export const useCopyNode = (options = {}) => createMutationHook({
  mutation: COPY_NODE,
  options
});


export const useSortingNodes = (options = {}) => createMutationHook({
    mutation: SORT_NODES_COLLECTION,
    options
});

