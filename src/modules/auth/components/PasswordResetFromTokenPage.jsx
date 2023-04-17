import React, { useState, useEffect } from 'react';
import Button from 'components/Buttons/Button';
import styles from './loginForm.module.scss'
import AuthPage from "./AuthPage";
import { toast } from "react-toastify";
import { phpApi } from "../../../utils/apis";
import { useNavigate, useParams } from "react-router-dom";

const PasswordResetFromTokenPage = () => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const { token } = useParams();
  
  useEffect(() => {
    if(error) {
      toast.error(error, {
        position: 'top-right',
        theme:"colored"
      });
      setError(null);
    }
  }, [error]);

  const handleSubmit = e => {
    e.preventDefault();

    if (email.length < 6 || email.indexOf('@') === -1) {
      toast.error('Email is not valid.', {
        position: 'top-right',
        theme:"colored"
      });
      return;
    }

    if (password.length < 6) {
      toast.error('Passwords must be more than 8 characters.', {
        position: 'top-right',
        theme:"colored"
      });
      return;
    }

    if (password.length > 40) {
      toast.error('Passwords must be less than 40 characters.', {
        position: 'top-right',
        theme:"colored"
      });
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match.', {
        position: 'top-right',
        theme:"colored"
      });
      return;
    }

    if (token.length === 0) {
      toast.error('Token is invalid.', {
        position: 'top-right',
        theme:"colored"
      });
      return;
    }

    submitPasswordResetRequest(email, password, confirmPassword, token);
  };

  const submitPasswordResetRequest = (email, password, confirmPassword, token) => {
    setLoading(true);
    phpApi(`password/reset`, {
      method: 'POST',
      body: {
        email: email,
        password: password,
        password_confirmation: confirmPassword,
        token: token
      }
    })
      .then(res => res.json())
      .then(data => {
        toast.success('Your password has been reset.', {
          position: 'top-right',
          theme:"colored"
        });
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      })
      .catch((error) => { setError(error?.data?.error); })
      .finally(() => setLoading(false));
  }

  const handleChange = e => {
    let {name, value} = e.target;
    if(name === 'email') setEmail(value);
    else if(name === 'password') setPassword(value);
    else if(name === 'confirmPassword') setConfirmPassword(value);
  };

  return (
    <AuthPage heading="Enter new password below">
      <form onChange={handleChange} onSubmit={handleSubmit} className={styles.form}>
        <div>
          <p>Select and confirm the password you wish to use below..</p>
          <div className="form-control">
            <input type="email" name="email" placeholder="Email" autoFocus="true"/>
          </div>
          <div className="form-control">
            <input type="password" name="password" placeholder="Password"/>
          </div>
          <div className="form-control">
            <input type="password" name="confirmPassword" placeholder="Confirm Password"/>
          </div>
          <Button
            type="submit"
            large
            secondary
            icon={'sign-in'}
            loading={loading}
            style={{marginRight:'0px', marginTop:'0px', width: '100%', textAlign: 'center'}}
          >Update password</Button>
        </div>
      </form>
    </AuthPage>
  );
}

export default PasswordResetFromTokenPage;