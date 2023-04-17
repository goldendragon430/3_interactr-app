import React, { useState, useEffect } from 'react';
import Button from 'components/Buttons/Button';
import AuthPage from '../../auth/components/AuthPage';
import helpText from 'utils/helpText';
import { toast } from "react-toastify";
import { phpApi } from "../../../utils/apis";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

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
    if(areInputsValid()) 
      register();
  };

  const register = () => {
    setLoading(true);
    phpApi(`register`, {
      method: 'POST',
      body: {
        email: email,
        password: password,
        password_confirmation: passwordConfirmation,
        name: name,
        transaction_id: transactionId
      }
    })
      .then(res => res.json())
      .then(data => {
        if(data?.success) {
          toast.success('You have been registered successfully.', {
            position: 'top-right',
            theme:"colored"
          });
          setTimeout(() => {
            navigate('/login');
          }, 2000);
        } else {
          setError(data?.message);
        }
      })
      .catch((error) => setError(error?.data?.message))
      .finally(() => setLoading(false));
  }

  const areInputsValid = () => {
    let valid = true;
    if(password.length < 6) {
      toast.error('Passwords must be at least 6 characters long!', {
        position: 'top-right',
        theme:"colored"
      });
      valid = false;
    } 
    
    if (password !== passwordConfirmation) {
      toast.error("Passwords don't match!", {
        position: 'top-right',
        theme:"colored"
      });
      valid = false;
    }

    if (!password || !passwordConfirmation || !name || !transactionId || !email) {
      toast.error('All fields are required!', {
        position: 'top-right',
        theme:"colored"
      });
      valid = false;
    }
    
    return valid;
  };

  const handleChange = e => {
    let { name, value } = e.target;
    if(name === 'name') setName(value);
    else if(name === 'email') setEmail(value);
    else if(name === 'password') setPassword(value);
    else if(name === 'password_confirmation') setPasswordConfirmation(value);
    else if(name === 'transaction_id') setTransactionId(value);
  };

  return (
    <AuthPage >
      <form onChange={handleChange} onSubmit={handleSubmit}>
        <div className="form-control">
          <label>Name</label>
          <input type="text" name="name" placeholder="Name" />
        </div>
        <div className="form-control">
          <label>Email</label>
          <input type="email" name="email" placeholder="Email" />
        </div>
        <div className="form-control">
          <label>password</label>
          <input type="password" name="password" placeholder="password" />
        </div>
        <div className="form-control">
          <label>Confirm Password</label>
          <input type="password" name="password_confirmation" placeholder="Password confirmation" />
        </div>
        <div className="form-control">
          <label>Transaction ID</label>
          <input type="text" name="transaction_id" placeholder="Transaction ID" />
          <article style={{marginTop: '5px'}}>{helpText.jvZooID}</article>
        </div>

        {/* {error && <div style={{background :'#ff6961', color: 'white', borderRadius: '25px', padding: '15px'}}>{error}</div>} */}

        <div className="form-control">
          <Button
            type="submit"
            large
            primary
            icon={'sign-in'}
            loading={loading}
            style={{ marginTop: 30, width: '100%', textAlign: 'center' }}
          >
            Register
          </Button>
        </div>
      </form>
    </AuthPage>
  );
}

export default RegisterPage;