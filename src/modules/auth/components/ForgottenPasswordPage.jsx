import React from 'react';
import Button from 'components/Buttons/Button';
import styles from './loginForm.module.scss'
import AuthPage from "./AuthPage";
import Icon from 'components/Icon'


export default class ForgottenPasswordPage extends React.Component {
  state = {
    email: '',
  };

  handleSubmit = e => {
    e.preventDefault();

    const {email} = this.state;

    if (email.length === 0 || email.indexOf('@') === -1) {
      toastr.error("Failed to send", "You have not provided a valid email address.");
      return;
    }

    this.props.sendPasswordResetEmail(email);
  };

  handleChange = e => {
    let {name, value} = e.target;
    this.setState({[name]: value});
  };

  resetSection = () => {
    return (
      <div>
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
        >Send Email <Icon name={'sign-in'} /></Button>
      </div>
    )
  };

  renderSuccess = ()=>{
    return(
        <p>Verification email has been sent. This may take a few minutes to come through.</p>
    )
  };

  render() {
    const {error} = this.props;

    return (
        <AuthPage heading="Forgotten Password">
            <form onChange={this.handleChange} onSubmit={this.handleSubmit} className={styles.form}>
                {this.renderBody()}
            </form>
        </AuthPage>
    );
  }

  renderBody(){
    const {error, emailOK} = this.props;

    // Form not submitted
    if(emailOK === null) {
      return this.resetSection();
    }

    if(error){
        toastr.error("Failed to send", "Email Address Not Found");
        return this.resetSection();
    }

    return this.renderSuccess();
  }
}
