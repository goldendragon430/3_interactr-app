import React from 'react';
import Styles from './Footer.module.scss';
import {Link} from 'react-router-dom';
import getAsset from 'utils/getAsset';

export default class Footer extends React.Component {
  /**
   * Need to hide the footer on some pages
   */
  showFooter(){
    let shouldShow = true;
    const path = window.location.href;

    if (path.includes('projects/')) {
      shouldShow = false;
    }

    //return shouldShow;

    // Going to hide on all pages for now not sure it works
    return false;
  }

  render(){
    const logo = getAsset('/img/logo.png');

    if (! this.showFooter()) return null;

    return(
      <div className={Styles.wrapper}>
        <div className={Styles.top}>
          <div className="grid">
            <div className="col3">
              <h4 className={Styles.heading}>Support</h4>
              <ul className={Styles.menu}>
                <li><Link to="/training">Training</Link></li>
                <li><a href="http://support.videosuite.io" target="_blank">FAQ's</a></li>
                <li><a href="https://www.facebook.com/groups/videosuite/" target="_blank">Facebook Group</a></li>
                <li><a href="http://support.videosuite.io" target="_blank">Support Desk</a></li>
                <li><a href="https://videosuite.zendesk.com/hc/en-us/requests/new" target="_blank">New Support Ticket</a></li>
              </ul>
            </div>
            <div className="col3">
              <h4 className={Styles.heading}>Quick Links</h4>
              <ul className={Styles.menu}>
                <li><Link to="/projects">Projects</Link></li>
                <li><Link to="/stats">Stats</Link></li>
              </ul>
            </div>
            <div className="col3">
              <h4 className={Styles.heading}>My Accounts</h4>
              <ul className={Styles.menu}>
                <li><Link to="/account/details">Settings</Link></li>
                <li><Link to="/account/integrations">Integrations</Link></li>
                <li><a onClick={()=>logout()}>Logout</a></li>
              </ul>
            </div>
            <div className="col3">
              {/* Logo */}
              <div className={Styles.logoWrapper}>
                <img src={logo} className={Styles.logo}/>
              </div>
            </div>
          </div>
        </div>
        <div className={Styles.bottom}>
          <h6>Powered By</h6>
          <img src="http://app.stikivid.com/img/videosuite-white.png"/>
          <p><small>&copy; Interactr. All Rights Reserved</small></p>
        </div>
      </div>
    )
  }
}