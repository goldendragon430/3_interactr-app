import React from 'react';
import Button from 'components/Buttons/Button';
import Spinner from 'components/Spinner';
import AuthPage from '../../auth/components/AuthPage';
import helpText from 'utils/helpText';
import styles from '../../auth/components/loginForm.module.scss';

export default class RegisterPage extends React.Component {
  state = {
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    transaction_id: ''
    // jvaccess: window.location.href.includes('jvaccess')
  };

  handleSubmit = e => {
    e.preventDefault();

    if(this.areInputsValid()) this.props.register(this.state);
    // if (this.areInputsValid()) console.log(this.state);
  };

  areInputsValid = () => {
    const { password, password_confirmation, name, transaction_id, email } = this.state;
    let valid = true;
    if(password.length < 6) {
      toastr.error('Validation Error', 'Passwords must be at least 6 characters long!');
      valid = false;
    } 
    
    if (password !== password_confirmation) {
      toastr.error('Validation Error', "Passwords don't match!");
      valid = false;
    }

    if (!password || !password_confirmation || !name || !transaction_id || !email) {
      toastr.error('Validation Error', 'All fields are required!');
      valid = false;
    }
    
    return valid;
  };

  handleChange = e => {
    let { name, value } = e.target;
    this.setState({ [name]: value });
  };

  render() {
    const { loading, error } = this.props;

    if (loading) return <Spinner />;

    return (
      <AuthPage >
        <form onChange={this.handleChange} onSubmit={this.handleSubmit}>
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

          {error && <div style={{background :'#ff6961', color: 'white', borderRadius: '25px', padding: '15px'}}>{error}</div>}

          <div className="form-control">
            <Button
              type="submit"
              large
              primary
              icon={'sign-in'}
              style={{ marginTop: 30, width: '100%', textAlign: 'center' }}
            >
              Register
            </Button>
          </div>
        </form>
      </AuthPage>
    );
  }
}
