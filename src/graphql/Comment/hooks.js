import { useMutation } from "@apollo/client";
import {createMutationHook, createQueryHook} from "../utils";
import {GET_COMMENTS} from "./queries";
import { CREATE_COMMENT, DELETE_COMMENT } from "./mutations";

export const useCommentCommands = (id = null) => {
  /**
   * Delete A Comment
   */
  const [deleteComment] = useMutation(DELETE_COMMENT, {
    update: (cache, {data}) => {
      // Remove the interaction from the cache
      const {id} = data.deleteComment;
      const key = cache.identify({
        id, __typename: 'Comment'
      })
      cache.evict({ id: key})
    }
  });

  return {
    deleteComment
  }
}

export const useComments = (vars = {project_id: null, page: 1, first: 25}) => createQueryHook({
  typename: 'Comment',
  query: GET_COMMENTS,
  variables: vars
});

export const useCreateComment = (options = {}) => createMutationHook({
  mutation: CREATE_COMMENT,
  options
});