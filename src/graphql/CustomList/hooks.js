import {addItem, createMutationHook, createQueryHook, deleteItem} from "../utils";
import {GET_CUSTOM_LISTS} from "./queries";
import {CREATE_CUSTOM_LIST, DELETE_CUSTOM_LIST} from "./mutations";


/**
 * Query the list of custom lists
 * @returns {[*, function(*=, *): void, {updateQuery: <TVars=OperationVariables>(mapFn: <TData>(previousQueryResult: any, options: Pick<WatchQueryOptions<TVars, any>, "variables">) => any) => void, fetchMore: (<K extends keyof OperationVariables>(fetchMoreOptions: (FetchMoreQueryOptions<OperationVariables, K, any> & FetchMoreOptions<any, OperationVariables>)) => Promise<ApolloQueryResult<any>>) & (<TData2, TVariables2, K extends keyof TVariables2>(fetchMoreOptions: ({query?: DocumentNode | TypedDocumentNode<any, OperationVariables>} & FetchMoreQueryOptions<TVariables2, K, any> & FetchMoreOptions<TData2, TVariables2>)) => Promise<ApolloQueryResult<TData2>>), networkStatus: NetworkStatus, refetch: <TVariables>(variables?: Partial<OperationVariables>) => Promise<ApolloQueryResult<any>>, loading: boolean, error: ApolloError | undefined}]}
 */
export const useCustomLists = () => createQueryHook({
    typename: 'CustomList',
    query: GET_CUSTOM_LISTS
});

/**
 * Create a single custom list
 * @param options
 * @returns {((function(*): Promise<FetchResult<any>>)|{data: any, called: boolean, loading: boolean, error: ApolloError})[]}
 */
export const useCreateCustomList = (options = {}) => createMutationHook({
    mutation: CREATE_CUSTOM_LIST,
    options: {
        update(cache, { data: { createCustomList } }) {
            addItem(cache, GET_CUSTOM_LISTS, createCustomList);
        },
        ...options
    }
});

/**
 * Delete a custom list
 * @param options
 * @returns {((function(*): Promise<FetchResult<any>>)|{data: any, called: boolean, loading: boolean, error: ApolloError})[]}
 */
export const useDeleteCustomList = (options = {}) => createMutationHook({
   mutation: DELETE_CUSTOM_LIST,
   options: {
       // Runs when the update mutation returns. as this
       // is a create action we need to manually update the
       // local cache
       update(cache, { data: { deleteCustomList } }) {
           deleteItem(cache, deleteCustomList.id, deleteCustomList.__typename);
       },
       ...options
   }
});