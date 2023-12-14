import React from 'react';
import { useQuery } from "@apollo/client";
import Button from "components/Buttons/Button";
import ErrorMessage from "components/ErrorMessage";
import MessageBox from "components/MessageBox";
import { LargeTextInput, Option, TextInput } from "components/PropertyEditor";
import gql from "graphql-tag";
import ContentLoader from "react-content-loader";
import { useParams } from "react-router-dom";
import { useProjectCommands } from "../../../graphql/Project/hooks";
import { errorAlert } from "../../../utils/alert";
import { useSetState } from "../../../utils/hooks";
import ReplaceProjectThumbnailButton from "./ProjectSharingPage/ReplaceProjectThumbnailButton";
import {toast} from 'react-toastify'
const QUERY = gql`
    query project($id: ID!){
        project(id: $id){
            id
            title
            description
            image_url
        }
    }
`

const ProjectSettings = () => {

  const {projectId} = useParams();

  const {data,loading, error} = useQuery(QUERY, {
    variables: {
      id: parseInt(projectId)
    },
  })

  if(error) return <ErrorMessage error={error} />;

  return(
    <div className={'grid'}>
      <div className={'col6'}>
        <h3 className="form-heading">Project Settings</h3>
        {(loading && <LoadingForm />)}
        {(!loading && <Form project={data?.project} />)}
      </div>
      <div className={'col5'}>
        <MessageBox>
          <h3>Project Settings</h3>
          <p>
            Give your project a title and a description. This information will be used in the app and also when you share the project on social media. 
          </p>
        </MessageBox>
      </div>
    </div>
  )
}
export default ProjectSettings;

const Form = ({ project }) => {
  const {saveProject} = useProjectCommands();

  const [state, setState] = useSetState({
    saving: false,
    title: project.title,
    description: project.description,
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
            title: state.title,
            description: state.description,
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

  const { title, description, saving } = state;

  return(
    <>
      <Option
        label="Name"
        name="name"
        value={title}
        disabled={saving}
        Component={TextInput}
        onChange={val => setState({ title: val })}
        onEnter={handleSave}
      />
      <Option
        label="Description"
        name="description"
        value={description}
        disabled={saving}
        Component={LargeTextInput}
        onChange={val => setState({ description: val })}
        onEnter={handleSave}
      />
      <div className="mt-1 clearfix mb-2">
        <Button 
          primary 
          loading={saving} 
          icon={'save'} 
          onClick={handleSave}
        >
          Save Changes
        </Button>
      </div>

      <div className="mt-1 clearfix mb-2">
        <label>Thumbnail</label>
        <div style={{position: 'relative', paddingBottom: '56.25%', display: 'flex', justifyContent: 'center', backgroundColor: '#eee'}}>
          <img src={project.image_url} className="img-fluid" style={{position: 'absolute', top: 0, height: '100%'}}/>
        </div>
        <div style={{float: 'left', marginTop: '15px'}}>
          <ReplaceProjectThumbnailButton />
        </div>
      </div>

    </>
  )
}

const LoadingForm = () => {

  return (
    <>
      <div className={'form-control'}>
        <label>Name</label>
        <ContentLoader
          speed={2}
          width="746"
          height="37"
          viewBox={`0 0 746 37`}
          backgroundColor="#f3f6fd"
        >
          {/* Only SVG shapes */}
          <rect x="0" y="0" rx="10" ry="10" width="746" height="37" />
        </ContentLoader>
      </div>
      <div className={'form-control'}>
        <label>Description</label>
        <ContentLoader
          speed={2}
          width="746"
          height="121"
          viewBox={`0 0 746 121`}
          backgroundColor="#f3f6fd"
        >
          {/* Only SVG shapes */}
          <rect x="0" y="0" rx="10" ry="10" width="746" height="121" />
        </ContentLoader>
      </div>
      <div className={'form-control'}>
        <label>Thumbnail</label>
        <ContentLoader
          speed={2}
          width="350"
          height="197"
          viewBox={`0 0 350 197`}
          backgroundColor="#f3f6fd"
        >
          {/* Only SVG shapes */}
          <rect x="0" y="0" rx="10" ry="10" width="350" height="197" />
        </ContentLoader>
      </div>
      <div className={'form-control'}>
        <ContentLoader
          speed={2}
          width="155"
          height="37"
          viewBox={`0 0 155 37`}
          backgroundColor="#f3f6fd"
        >
          {/* Only SVG shapes */}
          <rect x="0" y="0" rx="10" ry="10" width="155" height="37" />
        </ContentLoader>
      </div>
    </>
  )
}