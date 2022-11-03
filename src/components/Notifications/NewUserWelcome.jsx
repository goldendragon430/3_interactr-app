import React from 'react';
import Modal from 'components/Modal';
import LoginNotification from '../LoginNotification';
import Icon from 'components/Icon';
import Button from 'components/Buttons/Button';
import VideoPlayer from 'components/VideoPlayer';

export default class NewUserWelcome extends React.Component {
  state = {
    show: false,
    dismissed: false,
    name:'introWebinar',
    videoUrl: 'https://vimeo.com/255556667',
  };


  close = ()=>{
    this.setState({show:false})
    this.setState({videoUrl:''})
  };

  showModal = ()=>{
    this.setState({show:true})
  };

  dismiss = ()=>{
    this.close();
    const key = '_interactr-' + this.state.name;
    window.localStorage.setItem(key, 'true');
  };

  render(){
    const {show, name, videoUrl} = this.state;
    return null;
    return(
      <LoginNotification show={this.showModal} name={name}>
        <Modal
          show={show}
          onClose={this.close}
          height={525}
          width={720}
          heading={"Welcome to Interactr"}
          submitButtons={
            <>
              <Button icon="graduation-cap" primary onClick={()=>window.location.href = 'https://register.gotowebinar.com/register/5687393608206405634'}>
                Register For Webinar
              </Button>
              <Button onClick={this.dismiss} style={{float:'left'}}>
                Don't Show Again
              </Button>
            </>
          }
        >
          <div className="embed-responsive">
            <div className="embed-responsive-item">
              <VideoPlayer url={videoUrl} videoId={1} vimeo={true}/>
            </div>
          </div>
        </Modal>
      </LoginNotification>
    )
  }
}