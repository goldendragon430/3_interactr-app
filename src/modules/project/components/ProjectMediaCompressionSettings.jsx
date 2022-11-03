import React from 'react';
import Icon from "components/Icon";
import Button from "components/Buttons/Button";
import MessageBox from "components/MessageBox";
import {useProjectCommands} from "../../../graphql/Project/hooks";
import {errorAlert} from "../../../utils/alert";
import {useSetState} from "../../../utils/hooks";
import ErrorMessage from "components/ErrorMessage";
import {useProject} from "../../../graphql/Project/hooks";
import cx from 'classnames';
import styles from '../../media/components/uploadMedia/NewMediaSettingsModal.module.scss';


const ProjectMediaCompressionSettings = () => {
  const [project, {loading, error}] = useProject();

  if(error) return <ErrorMessage error={error} />;
  if(loading) return null;

  return(
    <div className={'grid'}>
      <div className={'col6'}>
        <h3 className="form-heading">Media Encoding</h3>
        <Form project={project} />
      </div>
      <div className={'col5'}>
        <MessageBox>
          <h3>Media Encoding</h3>
          <p>
            Please select the size you want to encode the videos uploaded to this project.
          </p>
          <p>
            The larger the video the longer it will take to load and play so we recommended
            encoding the video no larger than the size needed based on where your project will be embedded.
          </p>
        </MessageBox>
      </div>
    </div>
  )
}
export default ProjectMediaCompressionSettings;

const Form = ({ project }) => {
  const {saveProject} = useProjectCommands();

  const [state, setState] = useSetState({
    saving: false,
    encodedSize: project.video_encoding_resolution ? project.video_encoding_resolution : 1280,
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
            video_encoding_resolution: state.encodedSize,
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

  const { encodedSize, saving } = state;
  
  return(
    <>
      <ul style={{paddingLeft: 0}}>
        <CompressionItemSelect
          label={'4k'}
          description={'3840px x 2160px'}
          value={2160}
          selected={encodedSize}
          setSelected={(val)=>setState({
            encodedSize: val
          })}
        />
        <CompressionItemSelect
          label={'1080p'}
          description={'1920px x 1080px'}
          value={1080}
          selected={encodedSize}
          setSelected={(val)=>setState({
            encodedSize: val
          })}
        />
        <CompressionItemSelect
          label={'720p (Recommended)'}
          description={'1280px x 720px'}
          value={720}
          selected={encodedSize}
          setSelected={(val)=>setState({
            encodedSize: val
          })}
        />
        <CompressionItemSelect
          label={'540p'}
          description={'960px x 540px'}
          value={540}
          selected={encodedSize}
          setSelected={(val)=>setState({
            encodedSize: val
          })}
        />
        <CompressionItemSelect
          label="Don't Encode Media"
          description={'This will use the original media you provided'}
          value={0}
          selected={encodedSize}
          setSelected={(val)=>setState({
            encodedSize: val
          })}
        />
      </ul>
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

const CompressionItemSelect = ({label, value, selected, setSelected, description}) => {
  return(
    <div onClick={()=>setSelected(value)} className={cx(styles.sizeSelect, {[styles.active]: (selected===value)})}>
      <div className={'grid'}>
        <div className={'col1'} style={{marginTop: '11px'}}>
          {
            (selected===value) ? <Icon name={['fas', 'circle']} /> : <Icon name={['far', 'circle']} />
          }
        </div>
        <div className={'col11'}>
          <h4 style={{margin: 0}}>{label}</h4>
          <small style={{opacity: '0.8'}}>{description}</small>
        </div>
      </div>
    </div>
  )
}