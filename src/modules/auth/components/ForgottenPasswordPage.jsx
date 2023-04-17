import React, { useState, useEffect } from 'react';
import Button from 'components/Buttons/Button';
import styles from './loginForm.module.scss'
import AuthPage from "./AuthPage";
import Icon from 'components/Icon'
import { toast } from "react-toastify";
import { phpApi } from "../../../utils/apis";

const ForgottenPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);
  const [emailOK, setEmailOK] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if(error) {
      toast.error(error, {
        position: 'top-right',
        theme:"colored"
      });
      setError(null);
    }
  }, [error]);

  const sendPasswordResetEmail = () => {
    setLoading(true);
    phpApi(`password/email`, {
      method: 'POST',
      body: {email}
    })
      .then(res => res.json())
      .then(data => {
        if(data?.success) {
          setEmailOK(true);
        } else {
          setError(data.message);
        }
      })
      .catch((error) => setError(error?.data?.message))
      .finally(() => setLoading(false));
  }

  const handleSubmit = e => {
    e.preventDefault();

    if (email.length === 0 || email.indexOf('@') === -1) {
      toast.error('You have not provided a valid email address.', {
        position: 'top-right',
        theme:"colored"
      });
      return;
    }

    sendPasswordResetEmail(email);
  };

  const handleChange = e => {
    setEmail(e.target.value);
  };

  return (
    <AuthPage heading="Forgotten Password">
      <form onChange={handleChange} onSubmit={handleSubmit} className={styles.form}>
        {
          emailOK ? <p>Verification email has been sent. This may take a few minutes to come through.</p> :  <div>
          {/*<h1 className={styles.heading}>Reset password</h1>*/}
  
          <p>An email with a link to create a new password will be sent to the associated email address.</p>
          <div className="form-control">
            <input type="email" name="email" placeholder="Email"/>
          </div>
          <Button
            large
            icon={'arrow-left'}
            style={{float:'left'}}
            onClick={(e)=>{
              e.preventDefault();
              window.location.href = '/login';
            }}
          >Back</Button>
          <Button
            type="submit"
            large
            primary
            style={{float:'right'}}
            loading={loading}
          >Send Email <Icon name={'sign-in'} /></Button>
        </div>
        }
      </form>
    </AuthPage>
  );

}

export default ForgottenPasswordPage;