import React, {useState} from 'react';
import {Option, TextInput} from "../../../../components/PropertyEditor";
import Button from "../../../../components/Buttons/Button";
import MessageBox from "../../../../components/MessageBox";
import ResetPasswordModal from "../ResetPasswordModal";
import gql from "graphql-tag";
import {useQuery} from "@apollo/client";

const QUERY = gql`
    query AuthUser {
        result: me {
            id
        }
    }
`
const ResetPassword = () => {
  const {data} = useQuery(QUERY);

  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false)

  return(
    <div className={'grid'}>
      <div className={'col6'}>
        <h3 className="form-heading">Password</h3>
        <Option
          name="password"
          value={"**********"}
          disabled={true}
          Component={TextInput}
        />
        <Button
          primary
          icon={'lock'}
          onClick={() => setShowResetPasswordModal(true)}
        >Change Password</Button>
        <ResetPasswordModal
          user={data.result}
          show={showResetPasswordModal}
          close={()=> setShowResetPasswordModal(false)}
        />
      </div>
      <div className={'col5'}>
        <MessageBox>
          <h3>Login Password</h3>
          <p>
            To update your login password click the change password button. We recommend a password of at least 8 characters and a mixture of uppercase and lowercase letters and numbers.
          </p>
        </MessageBox>
      </div>
    </div>
  )
};
export default ResetPassword