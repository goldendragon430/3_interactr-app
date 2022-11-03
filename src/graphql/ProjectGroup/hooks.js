import {addItem, createLocalHook, createMutationHook, createQueryHook, deleteItem} from "../utils";
import {GET_PROJECT_GROUP, GET_PROJECT_GROUPS} from "./queries";
import {
  CREATE_PROJECT_GROUP,
  DELETE_PROJECT_GROUP,
  UPDATE_PROJECT_GROUP,
  UPDATE_PROJECT_GROUPS_SORTING
} from "./mutations";
import isEmpty from "lodash/isEmpty";
import {GET_PROJECTS} from "../Project/queries";
import _map from "lodash/map";

/**
 * Get single project group
 * @param folderId
 * @returns {[*, function(*=, *): void, {fetchMore: (<K extends keyof OperationVariables>(fetchMoreOptions: (FetchMoreQueryOptions<OperationVariables, K> & FetchMoreOptions<any, OperationVariables>)) => Promise<ApolloQueryResult<any>>) & (<TData2, TVariables2, K extends keyof TVariables2>(fetchMoreOptions: ({query?: DocumentNode} & FetchMoreQueryOptions<TVariables2, K> & FetchMoreOptions<TData2, TVariables2>)) => Promise<ApolloQueryResult<TData2>>), networkStatus: NetworkStatus, refetch: <TVariables>(variables?: Partial<OperationVariables>) => Promise<ApolloQueryResult<any>>, loading: boolean, error: ApolloError | undefined}]}
 */
export const useProjectGroup = (folderId) => createQueryHook({
  typename: 'ProjectGroup',
  query: GET_PROJECT_GROUP,
  variables: {folderId}
});

/**
 * Query the project groups
 * @returns {[*, *, {networkStatus: NetworkStatus, refetch: <TVariables>(variables?: Partial<OperationVariables>) => Promise<ApolloQueryResult<any>>, loading: boolean, error: ApolloError | undefined}]}
 */
export const useProjectGroups = () => createQueryHook({
  typename: 'ProjectGroup',
  query: GET_PROJECT_GROUPS,
});

/**
 * Create
 * @param options
 * @returns {((function(*): Promise<FetchResult<any>>)|{data: any, called: boolean, loading: boolean, error: ApolloError})[]}
 */
export const useCreateProjectGroup = (options = {}) => createMutationHook({
  mutation: CREATE_PROJECT_GROUP,
  options: {
    // Runs when the update mutation returns. as this
    // is a create action we need to manually update the
    // local cache
    update(cache, { data: { createProjectGroup } }) {
      addItem(cache, GET_PROJECT_GROUPS, createProjectGroup);
    },
    ...options
  }
});

/**
 * Update an existing project group, see options here:
 * @param options
 * @returns {((function(*): Promise<FetchResult<any>>)|{data: any, called: boolean, loading: boolean, error: ApolloError})[]}
 */
export const useSaveProjectGroup = (options = {}) => createMutationHook({
  mutation: UPDATE_PROJECT_GROUP,
  options
});

/**
 * Update new sorted project groups
 * @param options
 * @returns {((function(*): Promise<FetchResult<any>>)|{data: any, called: boolean, loading: boolean, error: ApolloError})[]}
 */
export const useSaveProjectGroupsSorting = (options = {}) => createMutationHook({
  mutation: UPDATE_PROJECT_GROUPS_SORTING,
  options: {
    update(cache, { data: { updateProjectGroupsSorting } }) {
      const { result } = cache.readQuery({ query: GET_PROJECT_GROUPS });
      const currentProjectGroups = [...result];

      const sortedProjectGroups = currentProjectGroups.map(projectGroup => {
        const sortedProjectGroup = updateProjectGroupsSorting.find(item => item.id === parseInt(projectGroup.id));

        const newProjectGroup = {...projectGroup};
        newProjectGroup.sort_order = sortedProjectGroup.sort_order_number;

        return newProjectGroup;
      });

      cache.writeQuery({
        query: GET_PROJECT_GROUPS,
        data: {
          result: sortedProjectGroups
        }
      })
    },
    ...options
  }
});

/**
 * Delete a single project group, see options here:
 * @param options
 * @returns {((function(*): Promise<FetchResult<any>>)|{data: any, called: boolean, loading: boolean, error: ApolloError})[]}
 */
export const useDeleteProjectGroup = (options = {}) => createMutationHook({
  mutation: DELETE_PROJECT_GROUP,
  options: {
    // Runs when the update mutation returns. as this
    // is a create action we need to manually update the
    // local cache
    update(cache, { data: { deleteProjectGroup } }) {
      const {variables, folderProjectIds} = options.getOuterVars();

      // update projects project_group_id to null as project group deleted
      try {
        const deletedFolderId = parseInt(deleteProjectGroup.id);

        if (! isEmpty(folderProjectIds)) {
          const data = cache.readQuery({
            query: GET_PROJECTS,
            variables: {
              ...variables,
              project_group_id: deletedFolderId
            }
          });

          const {result} = data;
          let newResult = {...result};
          const { data: projects } = result;
          const currentProjects = [...projects];

          newResult.data = _map(currentProjects, project => {
            let newProject = {...project};
            const projectId = parseInt(project.id);
            if (folderProjectIds.includes(projectId)) {
              newProject.project_group_id = null;
            }

            return newProject;
          });

          cache.writeQuery({
            query: GET_PROJECTS,
            variables: {
              ...variables,
              project_group_id: deletedFolderId
            },
            data: {
              result: {
                ...newResult
              },
            },
          });
        }
      } catch (e) {}

      deleteItem(cache, deleteProjectGroup.id, deleteProjectGroup.__typename);
    },
    ...options,
  }
});