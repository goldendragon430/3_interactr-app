import React from 'react';
import Button from "components/Buttons/Button";
import ErrorMessage from "components/ErrorMessage";
import MessageBox from "components/MessageBox";
import ContentLoader from "react-content-loader";
import { useProject, useProjectCommands } from "../../../graphql/Project/hooks";
import { useProjectGroups } from "../../../graphql/ProjectGroup/hooks";
import { errorAlert } from "../../../utils/alert";
import { useSetState } from "../../../utils/hooks";
import { AddProjectGroupModal } from "./AddProjectGroupModal";
import ProjectGroupsSelect from "./ProjectGroupsSelect";

const ProjectFolder = () => {
  const [project, updateProject, {loading, error}] = useProject();
  
  if(error) return <ErrorMessage error={error} />;
  if(loading) return null;

  return(
    <div className={'grid'}>
      <div className={'col6'}>
        <h3 className="form-heading">Project Folder</h3>
        <Form project={project} updateProject={updateProject} />
      </div>
      <div className={'col5'}>
        <MessageBox>
          <h3>Project Folder</h3>
          <p>
          The project folder allows you to neatly order your projects into different tabs on your project list page.          
          </p>
          <p>
          Agency users can add projects into a folder then give your sub users access to that folder.
          </p>
        </MessageBox>
      </div>
    </div>
  )
}
export default ProjectFolder;

const Form = ({ project, updateProject }) => {
  const { moveProject } = useProjectCommands();
  const [projectGroups, _, {loading, error}] = useProjectGroups();
  
  if(error) return <ErrorMessage error={error} />;

  const [state, setState] = useSetState({
    saving: false,
    projectGroupId: project.project_group_id,
    showCreateFolderModal: false
  });

  const handleSave = async () => {
    setState({
      saving: true
    });

    try {
      await moveProject({
        variables: {
          input: {
            id: project.id,
            project_group_id: Number(state.projectGroupId),
          }
        }
      })
    }
    catch(err){
      console.error(err)
      errorAlert({text: 'Unable to save changes'})
    }

    setState({
      saving: false
    });
  }

  const { projectGroupId, saving, showCreateFolderModal } = state;

  return(
    <>
      {
        loading ? <LoadingContent /> :
        <div className="grid">
          <div className="col9">
            <ProjectGroupsSelect
              value={projectGroupId}
              onChange={val => setState({ projectGroupId: val })}
              projectGroups={projectGroups}
            />
          </div>
          <div className="col3">
            <Button 
              primary 
              loading={saving} 
              icon={'plus'} 
              onClick={val => setState({ showCreateFolderModal: true })}
            />
          </div>
        </div>
      }
      <Button 
        primary 
        loading={saving} 
        icon={'save'} 
        onClick={handleSave}
      >
        Save Changes
      </Button>
      <AddProjectGroupModal
        show={showCreateFolderModal}
        toggle={() => setState({ showCreateFolderModal: !showCreateFolderModal })}
        onCreated={projectGroup => updateProject('project_group_id', projectGroup.id)}
      />
    </>
  )
}

const LoadingContent = () => {
  return (
    <div className={'form-control'}>
      <ContentLoader
        speed={2}
        width="746"
        height="50"
        viewBox={`0 0 746 50`}
        backgroundColor="#f3f6fd"
      >
        {/* Only SVG shapes */}
        <rect x="0" y="0" rx="10" ry="10" width="746" height="50" />
      </ContentLoader>
    </div>
  )
}