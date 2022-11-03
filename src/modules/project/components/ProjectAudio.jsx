import React from 'react';
import Button from "components/Buttons/Button";
import MessageBox from "components/MessageBox";
import {errorAlert} from "../../../utils/alert";
import {useSetState} from "../../../utils/hooks";
import ErrorMessage from "components/ErrorMessage";
import DropMediaAudioZone from "./DropMediaAudioZone";
import {useProject} from "../../../graphql/Project/hooks";
import {useProjectCommands} from "../../../graphql/Project/hooks";


const ProjectAudio = () => {
  const [project, {loading, error}] = useProject();
  
  if(error) return <ErrorMessage error={error} />;
  if(loading) return null;

  return(
    <div className={'grid'}>
      <div className={'col6'}>
        <h3 className="form-heading">Update Audio Track</h3>
        <Form project={project} />
      </div>
      <div className={'col5'}>
        <MessageBox>
          <h3>Update Audio Track (Change to Background Audio)</h3>
          <p>
          A background audio track will play on a loop in the background whenever your project is playing.      
          </p>
          <p>
          This is good for providing continuous background audio when user selections are at the end of a node. 
          </p>
        </MessageBox>
      </div>
    </div>
  )
}
export default ProjectAudio;

const Form = ({ project }) => {
  const { saveProject } = useProjectCommands();

  const [state, setState] = useSetState({
    saving: false,
    src: project.audio_track_url,
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
            audio_track_url: state.src,
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

  const { src, saving } = state;

  return(
    <>
      <DropMediaAudioZone
        src={src}
        isAudio={src && src.includes('mp3')}
        directory="audio"
        onSuccess={({src}) => setState({ src: src })}
      />
      <div style={{ marginTop: 25 }}>
        <Button 
          primary 
          loading={saving} 
          icon={'save'} 
          onClick={handleSave}
        >
          Save Changes
        </Button>
      </div>
    </>
  )
}