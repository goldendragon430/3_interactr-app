import React, {useState} from 'react';
import gql from "graphql-tag";
import {Option, TextInput} from "../../../../components/PropertyEditor";
import Button from "../../../../components/Buttons/Button";
import ResetPasswordModal from "../ResetPasswordModal";
import MessageBox from "../../../../components/MessageBox";
import {useQuery} from "@apollo/client";
import {useUserCommands} from "../../../../graphql/User/hooks";
import {errorAlert} from "../../../../utils/alert";
import ErrorMessage from "../../../../components/ErrorMessage";
import {useSetState} from "../../../../utils/hooks";
import {toast} from 'react-toastify'

const QUERY = gql`
    query AuthUser {
        result: me {
            id
            name
            email
        }
    }
`
const PersonalDetails = () => {
  const {data, loading, error} = useQuery(QUERY);

  if(error) return <ErrorMessage error={error} />;

  return(
    <div className={'grid'}>
      <div className={'col6'}>
        <h3 className="form-heading">Personal Details</h3>
        <Form user={ data.result} />
      </div>
      <div className={'col5'}>
        <MessageBox>
          <h3>Your Personal Details</h3>
          <p>
            The name here is kept private and only shown on the sidebar and dashboard to personalise your Interactr experience.
          </p>
          <p>
            The email shown here is the email used to login to the app. Remember if you change the email here you will need to use the new email to login.
          </p>
        </MessageBox>
      </div>
    </div>
  )
}
export default PersonalDetails;

const Form = ({user}) => {
  const {saveUser, updateUser} = useUserCommands();

  const [state, setState] = useSetState({
    saving: false,
    name: user.name,
    email: user.email
  })

  const handleSave = async () => {
    setState({
      saving: true
    });

    try {
      await saveUser({
        variables: {
          input: {
            id: user.id,
            name: state.name,
            email: state.email
          }
        }
      })
      toast.success('Email has been changed successfully.', {
        position: 'top-right',
        theme:"colored"
      });
    }
    catch(err){
      console.error(err)
      errorAlert({text: 'Unable to save changes'})
    }

    setState({
      saving: false
    });
  }

  const {name, saving, email} = state;

  return(
    <>
      <Option
        label="Name"
        name="name"
        value={name}
        disabled={saving}
        Component={TextInput}
        onChange={val => setState({name: val})}
        onEnter={handleSave}
      />
      <Option
        label="Email"
        name="email"
        value={email}
        disabled={saving}
        Component={TextInput}
        onChange={val => setState({email: val})}
        onEnter={handleSave}
      />
      <Button primary loading={saving} icon={'save'} onClick={handleSave}>Save Changes</Button>
    </>
  )
}