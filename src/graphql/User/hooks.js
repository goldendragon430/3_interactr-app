import {UPDATE_USER, CREATE_USER, DELETE_USER, UPDATE_SUBUSER} from "./mutations";
import {GET_AUTH_USER, GET_USER, GET_USERS} from "./queries";
import {addItem, createMutationHook, createQueryHook, deleteItem} from "../utils";
import {gql, useMutation, useReactiveVar} from "@apollo/client";
import { USER_FRAGMENT} from "./fragments";
import {isAgencyUser, isClubUser, isEvolutionUser, isProUser} from "../../modules/auth/authorization";
import mapValues from "lodash/mapValues";
import {cache} from "../client";
import {DELETE_INTERACTION} from "../Interaction/mutations";
import {setClientModal} from "../LocalState/clientModal";
import {getFields} from "../../utils/helpers";
import {getAcl} from "../LocalState/acl";
import reduce from 'lodash/reduce';

/**
 * Custom hook for using a user
 * @returns {[*, *, {networkStatus: NetworkStatus, refetch: (variables?: Partial<OperationVariables>) => Promise<ApolloQueryResult<any>>, loading: boolean, error: ApolloError | undefined}]}
 */
export const useUser = (id) => createQueryHook({
    typename: 'User',
    query: GET_USER,
    variables: {id}
});

/**
 * ! ONLY FOR ADMINS
 * Custom hook for searching users
 *
 * @param search
 * @param first
 * @param page
 * @returns {[*, *, {fetchMore: (<K extends keyof OperationVariables>(fetchMoreOptions: (FetchMoreQueryOptions<OperationVariables, K> & FetchMoreOptions<any, OperationVariables>)) => Promise<ApolloQueryResult<any>>) & (<TData2, TVariables2, K extends keyof TVariables2>(fetchMoreOptions: ({query?: DocumentNode} & FetchMoreQueryOptions<TVariables2, K> & FetchMoreOptions<TData2, TVariables2>)) => Promise<ApolloQueryResult<TData2>>), networkStatus: NetworkStatus, refetch: (variables?: Partial<OperationVariables>) => Promise<ApolloQueryResult<any>>, loading: boolean, error: ApolloError | undefined}]}
 */
export const useUsers = ({search = "", page = 1, first = 20}) => createQueryHook({
    typename: 'Users',
    query: GET_USERS,
    variables: {search, first, page}
})

/**
 * Custom hook for using an auth user
 * @returns {[*, *, {networkStatus: NetworkStatus, refetch: (variables?: Partial<OperationVariables>) => Promise<ApolloQueryResult<any>>, loading: boolean, error: ApolloError | undefined}]}
 */
export const useAuthUser = () => {
    const acl = useReactiveVar(getAcl);

    if(! acl.authUserId) return null;

    return cache.readFragment({
        id: `User:${acl.authUserId}`,
        fragment: USER_FRAGMENT
    });
};

/**
 * Update an existing user, see options here:
 * @param options
 * @returns {((function(*): Promise<FetchResult<any>>)|{data: any, called: boolean, loading: boolean, error: ApolloError})[]}
 */
export const useSaveUser = (options = {}) => createMutationHook({
    mutation: UPDATE_USER,
    options
});

/**
 * Create a new user, see options here:
 * @param options
 * @returns {((function(*): Promise<FetchResult<*>>)|{data: *, called: boolean, loading: boolean, error: ApolloError})[]}
 */
export const useCreateUser = (options = {}) => createMutationHook({
    mutation: CREATE_USER,
    options: {
        // Runs when the update mutation returns. as this
        // is a create action we need to manually update the
        // local cache
        update(cache, { data: { createUser } }) {
            // check where user is being created.
            // If it's agency page, update apollo cache and add new created user in list
            // If it's admin page, does not need to update users list, because the users in admin page are listed by 'pagination'
            if (createUser.parent_user_id) {
                
                const cacheKey = cache.identify({id: createUser.parent_user_id, __typename: 'User'});

                cache.modify({
                    id: cacheKey,
                    fields: {
                        subusers(oldSubUsers) {
                            return [...oldSubUsers, {
                                __ref:`${createUser.__typename}:${createUser.id}`
                            }];
                        }
                    }
                });
            }
        }, ...options
    }
});

/**
 * Delete a single user, see options here:
 * @param id
 * @param options,
 * @returns {((function(*): Promise<FetchResult<*>>)|{data: *, called: boolean, loading: boolean, error: ApolloError})[]}
 */
export const useDeleteUser = (id = null, options = {}) => createMutationHook({
    mutation: DELETE_USER,
    options: {
        // Runs when the update mutation returns. as this
        // is a create action we need to manually update the
        // local cache
        update(cache, { data: { deleteUser } }) {
            deleteItem(cache, deleteUser.id, deleteUser.__typename);

            const cacheKey = cache.identify({id: deleteUser.parent_user_id, __typename: 'User'});
            cache.modify({
                id: cacheKey,
                fields: {
                    subusers(oldSubUsers) {
                        const subUsers = reduce(
                            oldSubUsers,
                            (result, subUser) => {
                                if(subUser.__ref == `${deleteUser.__typename}:${deleteUser.id}`)
                                    return result;
                                return result.concat(subUser)
                            },
                            []
                        );
                        return subUsers;
                    }
                }
            });
        },
        ...options
    }
});

export const useSubUserCommands = (id = null) => {
    /**
     * Update User in the
     * cache
     * @param key
     * @param value
     * @param _id
     * @returns {*}
     */
    const updateSubUser = (key, value, _id) => {
        const userId = _id || id;
        if(! userId) {
            console.error("no ID passed to updateUser function");
            return;
        }

        // Allows for the func to receive the args
        // as func(key, value) OR
        // func({key:value, key:value})
        // so multiple can be updated at once
        const fields = getFields(key, value);

        const cacheKey = cache.identify({id: userId, __typename: 'User'});
        cache.modify({
            id: cacheKey,
            fields
        });
    };

    /**
     * Save subUser
     */
    const [saveSubUser] = useMutation(UPDATE_SUBUSER);

    /**
     * Delete subUser
     */
    const [deleteSubUser] = useMutation(DELETE_USER, {
        variables: {
            id: parseInt(id)
        },
        update: (cache, {data} )=>{
            // Remove the interaction from the cache
            const {id} = data.deleteUser;
            const key = cache.identify({
                id, __typename: 'User'
            });
            cache.evict({ id: key});
            setClientModal(false);
        }
    });

    return {
        updateSubUser,
        saveSubUser,
        deleteSubUser
    }
};

export const useUserCommands = (id = null) => {
    const [saveUser] = useMutation(UPDATE_USER);

    const updateUser = (key, value, _id = null) => {
        const userId = _id || id || key.id;
        const fields = getFields(key, value);
        const cacheKey = cache.identify({id: userId, __typename: 'User'});
        cache.modify({
            id: cacheKey,
            fields
        });
    }

    return {
        saveUser, updateUser
    }
}
