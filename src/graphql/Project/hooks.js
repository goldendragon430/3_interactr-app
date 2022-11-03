import {
  GET_PROJECT,
  GET_PROJECTS,
  GET_TEMPLATES_BY_ID,
  GET_SHARE_PAGE,
  GET_PROJECT_TEMPLATES,
  GET_PROJECTS_BY_ID
} from "./queries";
import {addItem, createMutationHook, createQueryHook, deleteItem} from "../utils";
import {
  COPY_PROJECT,
  CREATE_BLANK_PROJECT, CREATE_TEMPLATE_PROJECT,
  DELETE_PROJECT,
  PUBLISH_PROJECT, REGENERATE_SOCIAL_THUMBNAILS, UNPUBLISH_PROJECT,
  UPDATE_PROJECT
} from "./mutations";
import {useParams} from "react-router-dom";
import {useMutation, useReactiveVar, makeReference} from "@apollo/client";
import _size from 'lodash/size';
import {sharePageUrl} from "../../modules/project/utils";
import {DELETE_NODE} from "../Node/mutations";
import {errorAlert} from "../../utils/alert";
import client, { cache } from "../client";
import mapValues from "lodash/mapValues";
import {LIKE_TEMPLATE} from "../Project/mutations";
import {getWhitelabel} from "../LocalState/whitelabel";


export const useProjectCommands = (id = null) => {
  /**
   * Save a project
   */
  const [saveProject] = useMutation(UPDATE_PROJECT);

  /**
   * Move a project to different folder
   */
  const [moveProject] = useMutation(UPDATE_PROJECT, {
    update: (cache, {data} ) => {      
      updateProjectList(cache, data.updateProject);
    }
  });

  /**
   * Get the projects share page url with users custom domain name
   * @type {*|boolean}
   */
  const whitelabel = useReactiveVar(getWhitelabel);

  const getSharePageUrl = project => {
    const domain = (whitelabel) ? whitelabel.domain : false;
    return sharePageUrl(project, domain);
  }

  /**
   * Delete A Project
   */
  const [deleteProject] = useMutation(DELETE_PROJECT, {
    update: (cache, {data} )=>{
      // Remove the interaction from the cache
      const {id} = data.deleteProject;
      const key = cache.identify({
        id, __typename: 'Project'
      })
      cache.evict({ id: key})
    }
  });

  /**
   * Copy a project
   */
  const [copyProject] = useMutation(COPY_PROJECT, {
    update(cache, {data: {copyProject}}){
      if(copyProject.project_group_id){
        // if brand new project added in folder, update folder totals
        updateProjectGroupTotals(cache, copyProject);
      }
    }
  });

  /**
   * Create a new project from a DFY template
   */
  const [createProjectFromTemplate] = useMutation(CREATE_TEMPLATE_PROJECT, {
    update(cache, {data: {createTemplateProject}}){
      if(createTemplateProject.project_group_id){
        // if brand new project added in folder, update folder totals
        updateProjectGroupTotals(cache, createTemplateProject);
      }

      updateProjectList(cache, createTemplateProject);
    }
  })

  /**
   * Create a new blank template
   */
  const [createBlankProject]  = useMutation(CREATE_BLANK_PROJECT, {
    update(cache, {data: {createBlankProject}}) {
      if(createBlankProject.project_group_id){
        // if brand new project added in folder, update folder totals
        updateProjectGroupTotals(cache, createBlankProject);
      }

      updateProjectList(cache, createBlankProject);
    },
  });

  /**
   * Update the start node for a project
   * @param projectId
   * @param newStartNodeId
   * @returns {Promise<void>}
   */
  const updateStartNode = async (projectId, newStartNodeId) => {
    newStartNodeId = parseInt(newStartNodeId);

    cache.modify({
      id: `Project:${projectId}`,
      fields: {
        start_node_id: ()=>newStartNodeId
      }
    });

    try {
      await saveProject({
        variables:{
          input: {
            id: projectId,
            start_node_id: newStartNodeId
          }
        },
      })
    }catch(e){
      console.error(e);
      errorAlert({text: 'Unable to update start node'})
    }
  };

  const updateProject = (key, value, _id = null) => {
    const projectId = _id || id;

    const fields = (typeof key === 'object') ?
      mapValues(key, (k)=>{
        return ()=>{ return k }
      })
      : {[key]: ()=>{return value}}

    const cacheKey = cache.identify({id: projectId, __typename: 'Project'});
    cache.modify({
      id: cacheKey,
      fields
    });
  };


  const [publishProject] = useMutation(PUBLISH_PROJECT);

  const [unpublishProject] = useMutation(UNPUBLISH_PROJECT);

  return {
    saveProject, getSharePageUrl, deleteProject, moveProject,
    copyProject, createBlankProject, createProjectFromTemplate,
    updateStartNode, updateProject, publishProject, unpublishProject
  }
}



/**
 * Query the a list of projects
 * @param vars
 * @returns {[*, function(*=, *): void, {fetchMore: (<K extends keyof OperationVariables>(fetchMoreOptions: (FetchMoreQueryOptions<OperationVariables, K> & FetchMoreOptions<any, OperationVariables>)) => Promise<ApolloQueryResult<any>>) & (<TData2, TVariables2, K extends keyof TVariables2>(fetchMoreOptions: ({query?: DocumentNode} & FetchMoreQueryOptions<TVariables2, K> & FetchMoreOptions<TData2, TVariables2>)) => Promise<ApolloQueryResult<TData2>>), networkStatus: NetworkStatus, refetch: (variables?: Partial<OperationVariables>) => Promise<ApolloQueryResult<any>>, loading: boolean, error: ApolloError | undefined}]}
 */
export const useProjects = (vars = {search: "", first: 24, page: 1, project_group_id: null, orderBy: 'is_favourite', sortOrder: 'DESC'}) => createQueryHook({
  typename: 'Project',
  query: GET_PROJECTS,
  variables: vars
});

/**
 * Query the list of projects by ids
 * @param vars
 * @returns {[*, *, {updateQuery: <TVars=OperationVariables>(mapFn: <TData>(previousQueryResult: any, options: Pick<WatchQueryOptions<TVars, any>, "variables">) => any) => void, fetchMore: (<K extends keyof OperationVariables>(fetchMoreOptions: (FetchMoreQueryOptions<OperationVariables, K, any> & FetchMoreOptions<any, OperationVariables>)) => Promise<ApolloQueryResult<any>>) & (<TData2, TVariables2, K extends keyof TVariables2>(fetchMoreOptions: ({query?: DocumentNode | TypedDocumentNode<any, OperationVariables>} & FetchMoreQueryOptions<TVariables2, K, any> & FetchMoreOptions<TData2, TVariables2>)) => Promise<ApolloQueryResult<TData2>>), networkStatus: NetworkStatus, refetch: <TVariables>(variables?: Partial<OperationVariables>) => Promise<ApolloQueryResult<any>>, loading: boolean, error: ApolloError | undefined}]}
 */
export const useProjectsById = (vars = {projectIds: []}) => {
  if (! _size(vars.projectIds)) return [vars.projectIds, {loading: false}];

  return createQueryHook({
    typename: 'Project',
    query: GET_PROJECTS_BY_ID,
    variables: {projectIds: vars.projectIds}
  });
}


export const useProjectTemplates = (vars = {}) => createQueryHook({
  typename: 'ProjectTemplate',
  query: GET_PROJECT_TEMPLATES,
  variables: vars
});

/**
 * Query a single project
 * @returns {[*, function(*=, *): void, {networkStatus: NetworkStatus, refetch: <TVariables>(variables?: Partial<OperationVariables>) => Promise<ApolloQueryResult<any>>, loading: boolean, error: ApolloError | undefined}]}
 * @param id
 */
export const useProject = (id = null) => {
  const { projectId } = useParams();
  
  if(! id) {  
    id = projectId;
  }

  return createQueryHook({
    typename: 'Project',
    query: GET_PROJECT,
    variables: {projectId: id}
  });
};


/**
 * Update a single project
 * @param options
 * @returns {((function(*): Promise<FetchResult<*>>)|{data: *, called: boolean, loading: boolean, error: ApolloError})[]}
 */
export const useSaveProject = (options = {}) => createMutationHook({
  mutation: UPDATE_PROJECT,
  options
});

/**
 * Delete a single project
 * @param id
 * @param options
 * @returns {((function(*): Promise<FetchResult<*>>)|{data: *, called: boolean, loading: boolean, error: ApolloError})[]}
 */
export const useDeleteProject = (id = null, options = {}) => createMutationHook({
  mutation: DELETE_PROJECT,
  options: {
    // Runs when the update mutation returns. as this
    // is a create action we need to manually update the
    // local cache
    update(cache, { data: { deleteProject } }) {
      deleteItem(cache, deleteProject.id, deleteProject.__typename);
    },
    ...options
  }
});

/**
 * Copy a new project from existing
 * @param options
 * @returns {((function(*): Promise<FetchResult<*>>)|{data: *, called: boolean, loading: boolean, error: ApolloError})[]}
 */
export const useCopyProject = (options = {}) => createMutationHook({
  mutation: COPY_PROJECT,
  options
})

export const useTemplatesById = ids => createQueryHook({
  typename: 'Project',
  query: GET_TEMPLATES_BY_ID,
  variables: {ids}
});


export const useSharepage = hash => createQueryHook({
  typename: 'Project',
  query: GET_SHARE_PAGE,
  variables:{
    storage_path: 'projects/'+hash
  }
});

export const usePublishProject = (id = null) => {
  const {projectId} = useParams();
  const [mutation, { data , loading, error, called}] = useMutation(PUBLISH_PROJECT);

  const updateProject = () => {
    return mutation({
      variables: {
        id: (id) ? id : projectId
      }
    })
  };

  return [updateProject, {loading, error}];
};

export const useUnPublishProject = (id = null) => {
  if(! id) {
    const {projectId} = useParams();
    id = projectId;
  }

  return createMutationHook({
    mutation: PUBLISH_PROJECT,
    options: {id}
  })
};

/**
 * Regenerate project social thumbnails
 * @param options
 * @returns {((function(*): Promise<FetchResult<any>>)|{data: any, called: boolean, loading: boolean, error: ApolloError})[]}
 */
export const useRegenerateSocialThumbnails = (options = {}) => createMutationHook({
  mutation: REGENERATE_SOCIAL_THUMBNAILS,
  options: {
    update(cache, { data: {regenerateSocialThumbnails} }) {
      const projectId = regenerateSocialThumbnails.projectId.toString();
      const readQueryOptions = {
        query: GET_PROJECT,
        variables: {projectId}
      };

      let { result } = cache.readQuery(readQueryOptions);
      let newProjectData = {
        ...result,
        google_image_url: regenerateSocialThumbnails.google_image_url,
        facebook_image_url: regenerateSocialThumbnails.facebook_image_url,
        twitter_image_url: regenerateSocialThumbnails.twitter_image_url
      };

      let writeQueryOptions = {
        query: GET_PROJECT,
        data: {
          result: newProjectData,
        },
        variables: {projectId}
      };

      cache.writeQuery(writeQueryOptions);
    },
    ...options
  }
});

const updateProjectGroupTotals = (cache, createdProject) => {
  const projectGroupId = createdProject.project_group_id;

  if (projectGroupId) {
    const cacheKey = cache.identify({id: projectGroupId, __typename: 'ProjectGroup'});
    cache.modify({
      id: cacheKey,
      fields: {
        projects_count(projectsCount) {
          return ++projectsCount;
        }
      }
    });
  }
};

const updateProjectList = (cache, project) => {
  const projectGroupId = project.project_group_id;
  
  cache.modify({
    id: 'ROOT_QUERY',//cache.identify(makeReference('ROOT_QUERY')),
    fields: {
      projects: (existing, {toReference, storeFieldName }) => {
        // to get the project group id from parameters of the query
        let str = storeFieldName.split("project_group_id")[1];
        str = str.split(",")[0];
        str = str.split(":")[1];
        const queryProjectGroupId = str == "null" ? null : parseInt(str);

        // if group id is not the same, then no need to update projects list
        if(queryProjectGroupId != projectGroupId) 
          return existing;

        const newProjects = Object.assign({}, existing);
        const newProject = toReference(project, true);
        newProjects.data = [newProject, ...existing.data];
        if(newProjects.data.length > 24)
          newProjects.data = newProjects.data.slice(0, -1);
        return newProjects;
      },
    },
    optimistic: true,
  });
}

export const useProjectTemplateCommands = () => {

  const [likeTemplate] = useMutation(LIKE_TEMPLATE);

  return {
    likeTemplate
  }
};
