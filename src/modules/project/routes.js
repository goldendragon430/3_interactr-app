export const projectsPath = (id = -1, queryParams) => {
  if(id == -1)
    return "/projects";
    
  if (queryParams) {
    const {page, q, orderBy, sortOrder} = queryParams;
    return `/projects/folder/${id}?page=${page}&q=${q}&orderBy=${orderBy}&sortOrder=${sortOrder}`;
  }  

  return `/projects/folder/${id}`;
};

export const addProjectPath = (options) => {

  const activeTab = (options && options.activeTab) ? options.activeTab : "dfy-templates";
  const page = (options && options.page) ? options.page : 1;
  const title = (options && options.title) ? options.title : "";
  const search = (options && options.search) ? options.search : "";
  if(search == "" && title == "")
    return `/projects/add/${activeTab}?page=${page}`;
  if(search == "")
    return `/projects/add/${activeTab}?page=${page}&title=${title}`;
  if(title == "")
    return `/projects/add/${activeTab}?page=${page}&search=${search}`;  
  return `/projects/add/${activeTab}?page=${page}&search=${search}&title=${title}`;
};

export const projectPath = ({projectId, q = "", filterBy = "all", library = null, activeTab = 'all', page = 1}) => {
  if(library) {
    return `/projects/${projectId}?q=${q}&filterBy=${filterBy}&library=open&page=${page}&activeTab=${activeTab}`;
  }
  return `/projects/${projectId}`;
};

export const projectStatsPath = (...args) => {
  return projectPath(...args) + '/analytics';
};

export const projectChaptersPage = (...args) => {
  return projectPath(...args) + '/chapters';
};

export const projectSettingsPath = (...args) =>
  projectPath(...args) + '/settings';

export const adminPagePath = (...args) =>
  projectPath(...args) + '/admin';

export const publishProjectPath = (...args) =>
  projectPath(...args) + '/publish';

export const projectSurveyPath = (...args) =>
  projectPath(...args) + '/survey'

export const projectStatsImpressionsPath = (...args) => {
  return projectStatsPath(...args) + '/impressions'
}
export const projectStatsViewsPath = (...args) => {
  return projectStatsPath(...args) + '/views'
}
export const projectStatsEngagementPath = (...args) => {
  return projectStatsPath(...args) + '/engagement'
}

/**
 * Player Pages
 * @param args
 * @returns {string}
 */
export const projectPlayerPath = (...args) =>
  projectPath(...args) + '/player'

export const projectPlayerPlayingStatePath = (...args) => {
  return projectPlayerPath(...args) + '/playing'
}
export const projectPlayerSharingPath = (...args) => {
  return projectPlayerPath(...args) + '/sharing'
}
export const projectPlayerChaptersPath = (...args) => {
  return projectPlayerPath(...args) + '/chapters'
}

/**
 * Sharing Pages
 * @param args
 * @returns {string}
 */
export const projectSharingPage = (...args) => {
  return projectPath(...args) + '/sharing';
};
export const projectSharingShareDataPath = (...args) => {
  return projectSharingPage(...args) + '/share-data'
}
export const projectSharingCommentsPath = (...args) => {
  return projectSharingPage(...args) + '/likes-comments'
}