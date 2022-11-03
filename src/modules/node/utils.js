import {cache} from "../../graphql/client";

export const removeFromCache = (id) => {
  return cache.evict({ id: id})
}