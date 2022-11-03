import React from 'react';
import Button from 'components/Buttons/Button';
import styles from './loginForm.module.scss'
import AuthPage from "./AuthPage";

export default class PasswordResetFromTokenPage extends React.Component {
  state = {
    email: '',
    password: '',
    confirmPassword: '',
    token: ''
  };

  componentDidMount() {
    const href = window.location.href;
    const hrefParts = href.split("/");
    const token = hrefParts[hrefParts.indexOf('reset') + 1];
    this.setState({token});
  }

  handleSubmit = e => {
    e.preventDefault();

    const {email, password, confirmPassword, token} = this.state;
    if (email.length < 6 || email.indexOf('@') === -1) {
      toastr.error('Failed validation', 'Email is not valid.');
      return;
    }

    if (password.length < 6) {
      toastr.error('Failed validation', 'Passwords must be more than 6 characters.');
      return;
    }

    if (password.length > 40) {
      toastr.error('Failed validation', 'Passwords must be less than 40 characters.');
      return;
    }

    if (password !== confirmPassword) {
      toastr.error('Failed validation', 'Passwords do not match.');
      return;
    }

    if (token.length === 0) {
      toastr.error('Failed validation', 'Token is invalid.');
      return;
    }

    this.props.submitPasswordResetRequest(email, password, confirmPassword, token);
  };

  handleChange = e => {
    let {name, value} = e.target;
    this.setState({[name]: value});
  };

  resetSection = () => {
    return (
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
          style={{marginRight:'0px', marginTop:'0px', width: '100%', textAlign: 'center'}}
        >Update password</Button>
      </div>
    )
  };

  render() {
    return (
        <AuthPage heading="Enter new password below">
            <form onChange={this.handleChange} onSubmit={this.handleSubmit} className={styles.form}>
                {this.resetSection()}
            </form>
        </AuthPage>
    );
  }
}
