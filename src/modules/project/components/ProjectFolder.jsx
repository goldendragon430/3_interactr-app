import React from 'react';
import Button from "components/Buttons/Button";
import MessageBox from "components/MessageBox";
import {useProjectCommands} from "../../../graphql/Project/hooks";
import {useProject} from "../../../graphql/Project/hooks";
import {errorAlert} from "../../../utils/alert";
import {useSetState} from "../../../utils/hooks";
import ErrorMessage from "components/ErrorMessage";
import ProjectGroupsSelect from "./ProjectGroupsSelect";
import { AddProjectGroupModal } from "./AddProjectGroupModal";



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
      <div className="grid">
        <div className="col9">
          <ProjectGroupsSelect
            value={projectGroupId}
            onChange={val => setState({ projectGroupId: val })}
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