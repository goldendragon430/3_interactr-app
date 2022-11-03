import {createMutationHook, createQueryHook} from "../utils";
import {GET_AGENCY, GET_INTERACTIVE_VIDEOS, GET_WHITELABEL} from "./queries";
import { UPDATE_AGENCY } from "./mutations";
import {ourDomains} from '@/config';
import {useLazyQuery, useMutation} from "@apollo/client";
import mapValues from "lodash/mapValues";
import {cache} from "../client";

/**
 * Custom hook for using a user
 * @returns {[*, *, {networkStatus: NetworkStatus, refetch: (variables?: Partial<OperationVariables>) => Promise<ApolloQueryResult<any>>, loading: boolean, error: ApolloError | undefined}]}
 */
export const useAgency = () => createQueryHook({
    typename: 'Agency',
    query: GET_AGENCY,
});

/**
 * Update an agency item, see options here:
 * @param id
 * @param options
 * @returns {((function(*): Promise<FetchResult<any>>)|{data: any, called: boolean, loading: boolean, error: ApolloError})[]}
 */
export const useSaveAgency = (options = {}) => createMutationHook({
    mutation: UPDATE_AGENCY,
    options
});



// export const useWhitelabel = () => {
//     const whitelabel = cache.readQuery({
//         query: GET_WHITELABEL,
//         variables:{
//             domain: window.location.hostname
//         }
//     });
//
//     return ( whitelabel)  ? whitelabel.result : null;
// }


export const useAgencyCommands = (id = null) => {
    const [saveAgency] = useMutation(UPDATE_AGENCY);

    const updateAgency = (key, value, _id) => {
        const agencyId = _id || id;

        const fields = (typeof key === 'object') ?
          mapValues(key, (k)=>{
              return ()=>{ return k }
          })
          : {[key]: ()=>{return value}}

        const cacheKey = cache.identify({id: agencyId, __typename: 'Agency'});
        cache.modify({
            id: cacheKey,
            fields
        });
    };

    return {
        saveAgency, updateAgency
    }
};

