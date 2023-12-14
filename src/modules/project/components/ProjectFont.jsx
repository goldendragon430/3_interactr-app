import React from 'react';
import Button from "components/Buttons/Button";
import ErrorMessage from "components/ErrorMessage";
import MessageBox from "components/MessageBox";
import { Option } from "components/PropertyEditor";
import { useProject, useProjectCommands } from "../../../graphql/Project/hooks";
import SelectFont from "../../../modules/project/components/SelectFont";
import { errorAlert } from "../../../utils/alert";
import { useSetState } from "../../../utils/hooks";
import {toast} from 'react-toastify'


const ProjectFont = () => {
  const [project, {loading, error}] = useProject();
  
  if(error) return <ErrorMessage error={error} />;
  if(loading) return null;

  return(
    <div className={'grid'}>
      <div className={'col6'}>
        <h3 className="form-heading">Project Font</h3>
        <Form project={project} />
      </div>
      <div className={'col5'}>
        <MessageBox>
          <h3>Project Font</h3>
          <p>
            Define the font that will be used across the whole project. All buttons and text fields in this project will use this font on the interactr player.          
          </p>
        </MessageBox>
      </div>
    </div>
  )
}
export default ProjectFont;

const Form = ({ project }) => {
  const { saveProject } = useProjectCommands();

  const [state, setState] = useSetState({
    saving: false,
    font: project.font,
  });

  const handleSave = async () => {
    setState({
      saving: true
    });

    try {
      await saveProject({
        variables: {
          input: {
            id: project.id,
            font: state.font,
          }
        }
      })
      toast.success('Success')
    }
    catch(err){
      console.error(err)
      errorAlert({text: 'Unable to save changes'})
    }

    setState({
      saving: false
    });
  }

  const { font, saving } = state;

  return(
    <>
      <Option
        // label="Font"
        name="font"
        value={font}
        disabled={saving}
        Component={SelectFont}
        onChange={val => setState({ font: val })}
        onEnter={handleSave}
      />
      <Button 
        primary 
        loading={saving} 
        icon={'save'} 
        onClick={handleSave}
      >
        Save Changes
      </Button>
    </>
  )
}