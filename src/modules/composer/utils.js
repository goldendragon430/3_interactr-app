import { NODE_FRAGMENT } from '@/graphql/Node/fragments';
import mapValues from 'lodash/mapValues';
import {cache} from "../../graphql/client";

export function applyZoom(obj, zoom) {
  return mapValues(obj, (val) => val / zoom);
}

/** Gets the node from the cache using the node fragment
 * @param {string} id the node id
 */
export function getNodeFromCache(id) {
  return cache.readFragment({
    id: `Node:${id}`,
    fragment: NODE_FRAGMENT,
    fragmentName: 'NodeFragment',
  });
}

/** Updates the node data in the cache
 * @param {"ID"} nodeId the id of the node
 * @param {"Fields"} fields the fields property from the cache.modify
 */
export function cacheModifyNode(nodeId, fields) {
  cache.modify({
    id: `Node:${nodeId}`,
    fields
  })
}

export function cacheModifyButton(buttonId, fields) {
  cache.modify({
    id: `ButtonElement:${buttonId}`,
    fields
  })
}

export function scaleThePolygon(scaleBy) {
  let val1 = 159.33 / scaleBy;
  let val2 = 85.33 / scaleBy;
  let val3 = 128 / scaleBy;
  let val4 = 11.33 / scaleBy;
  let val5 = 170.66 / scaleBy;
  let val6 = 60 / scaleBy;
  let val7 = 85.33 / scaleBy;
  let val8 = 11.33 / scaleBy;
  let val9 = '0';
  let val10 = 85.33 / scaleBy;
  let val11 = 42.66 / scaleBy;

  return `${val1},${val2} ${val2},${val3} ${val4},${val5} ${val6},${val7} ${val8},${val9} ${val10},${val11}`;
}
