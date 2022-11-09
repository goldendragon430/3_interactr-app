import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom'
import Button from 'components/Buttons/Button';
import LinkButton from 'components/Buttons/LinkButton'
import styles from './loginForm.module.scss';
import AuthPage from './AuthPage';
import PropTypes from 'prop-types';
import cx from "classnames";
import {Link} from "react-router-dom";
import {useSetState} from "../../../utils/hooks";

import {login} from "../utils";
import {useReactiveVar} from "@apollo/client";
import {getWhitelabel} from "../../../graphql/LocalState/whitelabel";
import {setToken}  from '@/modules/auth/utils';

const LoginPage = () => {
  const location = useLocation();
  const searchQuery = new URLSearchParams(location.search);

  useEffect(() => { 
    const token = searchQuery.get('token');
    if(token) {
      setToken(token);
      window.location.href = '/';
    }
  }, []);

  const [state, setState] = useSetState({
    email: '',
    password: '',
    passwordType:'password',
    error: false,
    loading: false
  });

  const redirectUrl = searchQuery.get('redirect') || '/';

  const whitelabel = useReactiveVar(getWhitelabel);

  const handleLogin = async (e) => {
    e.preventDefault();
    
    const {email, password} = state;
    setState({loading: true});
    try {
      await login({email, password, redirectUrl});
    }catch(err){
      const userMessage = err?.response?.data;
      const networkError =  {userMessage: 'Server Error'};
      setState({error: userMessage || networkError});
    }

    setState({loading: false});
  };

  const tip = () => {
    return !whitelabel ? (
      <div style={{ marginBottom: '30px' }}>
        <h4 style={{ marginBottom: '0px' }}>New User?</h4>
        <p>
          Check your emails for an email from chris@videosuite.io with your password. You can also use the reset
          password functionality below. If you have any issues you can contact our support team by email on{' '}
          <strong>support@videosuite.io</strong>
        </p>
      </div>
    ) : null;
  }

  const whitelabelStyle = (whitelabel)
    ? {
        borderTopColor: whitelabel.primary_color
      }
    : {};

  if (whitelabel) {
    // Prevents notifications showing when it's a whitelabel account
    window.localStorage.removeItem('previousPage');
  }
  if (__DEV__) console.log('whitelabel ? ', whitelabel);

  const {email, passwordType, password, error, loading} = state;
  
  return (
    <AuthPage heading="Welcome Back" tip={tip()} >
      <form className={styles.form} style={whitelabelStyle}>
        <div className="form-control ">
          <label>Email Address</label>
          <input
              type="email"
              name="email"
              className="rounded"
              placeholder="Email"
              onChange={e => setState({email: e.target.value})}
              value={email}
          />
        </div>
        <div className={cx(styles.passwordField, "form-control")}>
          <label>Password</label>
          <input
              type={passwordType}
              name="password"
              className="rounded"
              placeholder="Password"
              onChange={e => setState({password: e.target.value})}
              value={password}
          />
          {passwordType === 'password' && (
              <small onClick={() => setState({passwordType: 'text'})}>SHOW</small>
          )}
          {passwordType === 'text' && (
              <small onClick={() => setState({passwordType: 'password'})}>HIDE</small>
          )}
        </div>
        {!!error && (
          <div className={styles.error}>
            <p>{error.message}</p>
          </div>
        )}
        <div className={styles.footer}>
          {!whitelabel ? (
            <a href={'/forgotten-password'} className={styles.forgotPasswordButton}>
              Reset Password?
            </a>
          ) : null}
          <Button
            onClick={handleLogin}
            large
            primary
            rightIcon
            icon={'sign-in-alt'}
            noMarginRight
            loading={loading}
          >
            Login
          </Button>
        </div>
      </form>
      {!whitelabel && (
          <div className="text-center" style={{padding: '20px', paddingBottom: '60px'}}>
            <p style={{color: 'white'}}>
              <strong>Purchased via JVZOO?</strong>
              &nbsp;Create your account <Link to={'/register/jvzoo'}><span style={{textDecoration: 'underline', color:'white'}}>here</span></Link>
            </p>
          </div>
      )}
    </AuthPage>
  );
};

LoginPage.propTypes = {
  whitelabel: PropTypes.any,
  /** error msg if any */
  error: PropTypes.string,
  // login: PropTypes.func.isRequired
};

export default LoginPage;