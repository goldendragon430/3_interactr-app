import {Map} from 'immutable';
import {useParams, useNavigate} from "react-router-dom";
/*
  Takes data such as
  {
    element_type: 'Hotspot',
    element: {...element}
  }

  and returns 
  [{
    element_type: 'Hotspot',
    element_id: 1
  },
  {
    ...element,
    element_type: 'Hotspot',
  }]
*/
export function splitElementFromObj({element, element_type, ...obj}) {
  if (!element_type || !element) {
    console.error('Element has invalid data, encountered during processing elements\n', ...arguments)
    return [obj, {}]
  }

  element.element_type = element_type;
  obj.element_type = element_type;
  obj.element_id = element.id;
  obj.name = element.name;

  return [obj, element];
}

export function splitElementsFromContainers(containers) {
  return containers.reduce(
    (memo, obj) => {
      const [object, element] = splitElementFromObj(obj);
      memo[0].push(object);
      memo[1].push(element);
      return memo;
    },
    [[], []]
  );
}

// expects args to be immutable
export function joinWithElement(obj, elements = Map()) {
  const element_type = obj.get('element_type');
  const element_id = obj.get('element_id').toString();
  return obj.set('element', elements.getIn([element_type, element_id]));
}

// normalizes elements out of collection
export function processElements(
  collection,
  elementsKey = 'elements',
  processor
) {
  return collection.reduce(
    (memo, item) => {
      const [elementContainers, elements] = splitElementsFromContainers(
        item[elementsKey]
      );
      memo[0].push({...item, [elementsKey]: elementContainers});
      memo[1] = memo[1].concat(elements);
      if (processor) {
        memo = processor(memo, item);
      }
      return memo;
    },
    [[], []]
  );
}
