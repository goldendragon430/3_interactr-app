import React from 'react';
import {Option, TextInput} from "components/PropertyEditor";
import Button from "components/Buttons/Button";
import MessageBox from "components/MessageBox";
import {useProjectCommands} from "../../../graphql/Project/hooks";
import {useProject} from "../../../graphql/Project/hooks";
import {errorAlert} from "../../../utils/alert";
import {useSetState} from "../../../utils/hooks";
import ErrorMessage from "components/ErrorMessage";


const ProjectFacebookPixel = () => {
  const [project, updateProject, {loading, error}] = useProject();
  
  if(error) return <ErrorMessage error={error} />;
  if(loading) return null;

  return(
    <div className={'grid'}>
      <div className={'col6'}>
        <h3 className="form-heading">Facebook Pixel</h3>
        <Form project={project} updateProject={updateProject} />
      </div>
      <div className={'col5'}>
        <MessageBox>
          <h3>Facebook Pixel</h3>
          <p>
            Fire custom events from
          </p>
        </MessageBox>
      </div>
    </div>
  )
}
export default ProjectFacebookPixel;

const Form = ({ project }) => {
  const { saveProject } = useProjectCommands();

  const [state, setState] = useSetState({
    saving: false,
    fbPixelId: project.fbPixelId,
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
            fbPixelId: Number(state.fbPixelId),
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

  const { fbPixelId, saving } = state;

  return(
    <>
      <Option
        name="facebook-pixel"
        value={fbPixelId}
        disabled={saving}
        Component={TextInput}
        onChange={val => setState({ fbPixelId: val })}
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