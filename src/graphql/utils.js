import {useLocation, useParams} from "react-router-dom";
import omit from 'lodash/omit';
import client from "./client";
import {gql, useMutation, useQuery, useSubscription} from "@apollo/client";
import Swal from "sweetalert2";
import {capitalize} from "../utils/textUtils";


/**
 * The query hook returns data and an API for updating the store.
 * @param query
 * @param typename
 * @param variables
 * @returns {[any, update, {networkStatus: NetworkStatus, refetch: <TVariables>(variables?: Partial<OperationVariables>) => Promise<ApolloQueryResult<any>>, loading: boolean, error: ApolloError}]}
 */
export const createQueryHook = ({query, typename, variables})=>{
  // Get the data from API
  const { loading, error, data, refetch, networkStatus, fetchMore, updateQuery }  = useQuery(query, {notifyOnNetworkStatusChange: true, variables});

  // Network Status
  // https://github.com/apollographql/apollo-client/blob/master/src/core/networkStatus.ts


  // Saves data to the cache but NOT the db
  const update = (key, value) => {
    // Is the new data passed in as key, value in 2 arguments or as an object. For performance
    // we need to support both methods as often in the element we need to update positionable
    // values at the same time.
    const newData =
      (typeof key === 'object') ?
        {...data.result, ...key}
        : {...data.result, [key]: value };

    // console.log('-- Update Cache --');
    // console.log(newData);
    // console.log('------------------');    
    client.writeQuery({
      data:{ result : newData },
      query
    });
  };

  return [data?.result, update, {loading, error, refetch, networkStatus, fetchMore, updateQuery}]
};

/**
 * Create the graphQL mutation props
 *
 * @param id
 * @param mutation
 * @param fieldsToOmit
 * @param options
 * @returns {((function(*): Promise<FetchResult<any>>)|{data: any, called: boolean, loading: boolean, error: ApolloError})[]}
 */
export const createMutationHook = ({id = null, mutation, options, fieldsToOmit})=>{
  // setting the data via a mutation
  const [updateMutation, { data , loading, error, called}] = useMutation(mutation, options);

  // This callback function can work for among create, update and delete actions
  // DELETE mutation usage - 'data' arg must be null, and 'id' arg must be valid number
  // CREATE mutation usage - 'id' arg must be null, and 'data' arg should not contain 'id' prop
  // UPDATE mutation usage - either 'data' arg should contain 'id' prop or 'id' arg should be valid
  const func = async (data = null, _id = null) => {
    let fieldsToUpdate = omit( data, ['__typename', ].concat(fieldsToOmit) );

    if(data === null) {
      // No data hs been passed in so we can just pass the ID back to the mutation
      if(id || _id) {
        // passed in takes priority over the intial ID
        const __id = _id || id;
        return updateMutation({
          variables: {
            id: __id
          }
        });
      }
      else {
        throw new Error("No ID or data passed into mutation");
      }
    }

    // If both id's are null, it's create mutation, should not include 'id' prop in data
    if (id !== null && _id !== null) {
      // passed in takes priority over the intial ID
      fieldsToUpdate.id =  _id || id;
    }


    return updateMutation({
      variables: {
        input: fieldsToUpdate
      }
    });
  };

  return [func, { data , loading, error, called}];
};

/**
 * Create the graphql subscription props
 * @param subscription
 * @param options
 * @returns {[*[], {loading: boolean, error: ApolloError}]}
 */
export const createSubscriptionHook = ({subscription, options}) => {
  const {data, loading, error} = useSubscription(subscription, options);

  return [data?.result, {loading, error}];
};

/**
 * We need to provide the same API from the createLocalHook as the createHook so we return
 * data and softUpdate in the first object of the array. The second object of the array
 * handles the mutation in normal queries. Local Vars have no mutations so only return
 * the first object in the array to keep things consistent.
 * @param $var
 * @param query
 * @returns {[data: any, update: update, {loading: boolean, error: ApolloError}]}
 */
export const createLocalHook = ({$var, query}) => {
  const { loading, error, data }  = useQuery(query);

  /**  can take a key value pair or a new Data object for mass updates 
  * @param {object | string} keyOrData
  * @param {*} value 
  */
  function update (keyOrData, value) {
    const oldData = $var();

    if(keyOrData && typeof keyOrData == 'object') {
      $var({...oldData, ...keyOrData})
    } else $var({...oldData, [keyOrData]:value})
  };

  return [data?.result, update, {loading, error}];
};


/**
 * Field fragment for the paginator
 * @type {DocumentNode}
 */
export const PAGINATOR_FIELDS = gql`
  fragment PaginatorFragment on PaginatorInfo {
    total
    count
    perPage
    hasMorePages
    currentPage
    lastPage
  }
`;



/**
 * BASE helper of cache update mutations methods (addItem, removeItem etc.)
 * @param cache
 * @param QUERY
 * @param object
 * @param key
 * @param queryVars
 * @param updateActionCallback
 * @function updateActionCallback
 */
const updateCache = (cache, QUERY, object, key = null, queryVars = null, updateActionCallback) => {
  const readQueryOptions = {
    query: QUERY
  };

  if (queryVars) {
    readQueryOptions.variables = queryVars;
  }

  let { result } = cache.readQuery(readQueryOptions);

  let brandNewCollection;

  if (Array.isArray(result)) {
    brandNewCollection = [...result];
  } else if (typeof result === 'object') {
    brandNewCollection = {...result};
  }
  if ( !key) {
    brandNewCollection = updateActionCallback(brandNewCollection, object);
  } else {
    brandNewCollection[key] = updateActionCallback(brandNewCollection, object);
  }

  let writeQueryOptions = {
    query: QUERY,
    data: {
      result: brandNewCollection,
    },
  };

  writeQueryOptions.variables = queryVars;

  cache.writeQuery(writeQueryOptions);
};

/**
 * Add newly created item into a special collection based on params
 * @param cache
 * @param QUERY
 * @param newObject
 * @param keyToAppend
 * @param queryVars
 */
export const addItem = (cache, QUERY, newObject, keyToAppend, queryVars = null) => {
  return updateCache(cache, QUERY, newObject, keyToAppend, queryVars,
      (brandNewCollection, object) => {
         if ( !keyToAppend) {
          return [...brandNewCollection, object];
        }
        return [...brandNewCollection[keyToAppend], object]
      }
  );
}

/**
 * Delete item from the collection based on argument params
 * @param cache
 * @param id
 * @param typename
 */
export const deleteItem = (cache, id, typename) => {
  return cache.evict({id: `${typename}:${id}`})
}

/**
 * The confirm popup helper to use for multiple types of confirmations like delete/copy/create etc.
 * @param item
 * @param actionType - define the confirmation type "Delete", "Copy", "Create" etc.
 * @param success
 * @function success - the callback function that runs IF popup message confirmed
 * @returns {Promise<unknown>}
 */
const confirmPopup = (item, actionType = 'delete', success = () => {}) => {
  let type;
  let confirmButtonColor;

  switch (actionType) {
    case "delete":
      type = 'warning';
      confirmButtonColor = '#ff6961';
      break;
    case "copy":
      type = 'info';
      confirmButtonColor = '#366fe0';
      break;
    case "create":
      type = 'success';
      confirmButtonColor = '#41c186';
      break;
  }

  return Swal.fire({
    title: `${capitalize(actionType)} ${item}`,
    text: `Are you sure you wish to ${actionType} this ${item}?`,
    icon: type,
    showCloseButton: true,
    showCancelButton: true,
    confirmButtonColor,
    confirmButtonText: `${capitalize(actionType)} ${item}`
  }).then((result) => {
    if(result.isConfirmed){
      success();
    }
  });
}

/**
 * Displays confirmation form to the user for deleting selected item
 *
 * @param success
 * @param item - this argument is used to define which type of item the user are going to delete
 * Ex. user/project/projectGroup/media etc.
 */
export const deleteConfirmed = (item = "item", success) => {
  return confirmPopup(item, 'delete', success)
};

/**
 * Displays confirmation form to the user for copying selected item
 *
 * @param item
 * @param success
 * @returns {Promise<unknown>}
 */
export const copyConfirmed = (item = "item", success) => {
  return confirmPopup(item, 'copy', success);
}

/**
 * Parse url GET queries
 * @returns {URLSearchParams}
 */
export const useURLQuery = () => {
  return new URLSearchParams(useLocation().search);
};



