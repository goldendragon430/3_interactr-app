import {createQueryHook} from "../utils";
import {GET_MODAL, GET_MODAL_ELEMENT, GET_MODALS} from "./queries";
import {useMutation} from "@apollo/client";
import {
  APPLY_TEMPLATE,
  COPY_MODAL,
  COPY_MODAL_ELEMENT, CREATE_MODAL,
  CREATE_MODAL_ELEMENT, DELETE_MODAL,
  DELETE_MODAL_ELEMENT,
  UPDATE_MODAL,
  UPDATE_MODAL_ELEMENT
} from "./mutations";
import mapValues from "lodash/mapValues";
import {cache} from "../client";


export const useModal = id => createQueryHook({
  typename: 'Modal',
  query: GET_MODAL,
  variables: {id}
});

export const useModalElement = id => createQueryHook({
  typename: 'ModalElement',
  query: GET_MODAL_ELEMENT,
  variables:{id}
});

export const useModals = project_id => createQueryHook({
  typename: 'Modal',
  query: GET_MODALS,
  variables: {project_id}
});

export const useModalElementCommands = (id = null) => {
  /**
   * Delete Interaction
   */
  const [deleteModalElement] = useMutation(DELETE_MODAL_ELEMENT, {
    update: (cache, {data} )=>{
      // Remove the item from the cache
      const {id} = data.deleteModalElement;
      const key = cache.identify({
        id, __typename: 'ModalElement'
      })
      cache.evict({ id: key})
    }
  });

  const [saveModalElement] = useMutation(UPDATE_MODAL_ELEMENT);


  const [createModalElement, {loading: createLoading}] = useMutation(CREATE_MODAL_ELEMENT, {
    update: (cache, {data}) => {
      const modalKey = cache.identify({
        id: data.result.modal_id,
        __typename: 'Modal'
      });

      cache.modify({
        id: modalKey,
        fields: {
          elements(currentElements){
            return [
              ...currentElements,
              {__ref: 'ModalElement:' + data.result.id}
            ]
          }
        }
      })
    }
  });

  /**
   * Copy a modal element
   */
  const [copyModalElement] = useMutation(COPY_MODAL_ELEMENT, {
    update: (cache, {data}) => {
      const modalKey = cache.identify({
        id: data.result.modal_id,
        __typename: 'Modal'
      });

      cache.modify({
        id: modalKey,
        fields: {
          elements(currentElements){
            return [
              ...currentElements,
              {__ref: 'ModalElement:' + data.result.id}
            ]
          }
        }
      })
    }
  })


  return {
    deleteModalElement,
    saveModalElement,
    createModalElement,
    copyModalElement,
    createLoading
  }
};

export const useModalCommands = (id) => {
  const [saveModal] = useMutation(UPDATE_MODAL);

  /**
   * Update Interaction in the
   * cache
   * @param key
   * @param value
   * @param _id
   * @returns {*}
   */
  const updateModal = (key, value, _id) => {
    const modalId = _id || id;
    if(! modalId) {
      console.error("no ID passed to updateModal function")
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
      : {[key]: ()=>{
        return value
      }}
    
    const cacheKey = cache.identify({id: modalId, __typename: 'Modal'});
    cache.modify({
      id: cacheKey,
      fields
    });
  }

  /**
   * Copy a modal
   */
  const [copyModal] = useMutation(COPY_MODAL);

  /**
   * Create new modal
   */
  const [createModal] = useMutation(CREATE_MODAL);

  const [applyTemplate] = useMutation(APPLY_TEMPLATE);

  /**
   * Delete a modal
   */
  const [deleteModal] = useMutation(DELETE_MODAL, {
    update: (cache, {data} )=>{
      // Remove the item from the cache
      const {id} = data.deleteModal;
      const key = cache.identify({
        id, __typename: 'Modal'
      })
      cache.evict({ id: key})
    }
  });

  return {saveModal, updateModal, copyModal, createModal, applyTemplate, deleteModal}
};