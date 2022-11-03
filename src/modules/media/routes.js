export const videosPath = ({page = 1, q = "", orderBy = "created_at", project_id = 0, sortOrder = 'DESC', filterBy = 'all', activeTab = 'all'}) => {

  return `/media?filterBy=${filterBy}&page=${page}&q=${q}&orderBy=${orderBy}&sortOrder=${sortOrder}&project_id=${project_id}&activeTab=${activeTab}`;
};