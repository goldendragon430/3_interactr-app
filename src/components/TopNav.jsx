import React from 'react';
import styles from './TopNav.module.scss';
// import SubNav from './__SubNav';
import LinkButton from './Buttons/LinkButton';
import Button from './Buttons/Button';
import { error } from 'utils/alert';
import AppLogo from './AppLogo';
import TopNavAnnouncemnt from './TopNavAnnouncement';
import { Link } from 'react-router-dom';
import Icon from 'components/Icon';
import GlobalSearch from 'components/GlobalSearch.jsx';
import * as externalLinks from 'utils/externalLinks';

export default class TopNav extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      account_dropdown_open: false
    };

    this.logoutUser = this.logoutUser.bind(this);
  }

  logoutUser() {
    this.props.updatePageLoadingState(true);
    logout();
  }

  canUpgrade(user) {
    if (user.parent_user_id !== 0) return false;
    if (user.subscription_user) return false;
    if (user.is_club) return false;

    return true;
  }

  render() {
    const { user } = this.props;
    const canUpgrade = this.canUpgrade(user);
    const menuStyle = this.state.account_dropdown_open
      ? {
          opacity: 1,
          zIndex: 2000,
          overflow: 'visible'
        }
      : {};

    return (
      <div className={styles.TopNav}>
        <div className={styles.menuLeft}>
          <GlobalSearch />
        </div>

        <div className={styles.menuCentre}>
          <AppLogo />
        </div>

        <div className={styles.menuRight}>
          <div className={styles.my_account_dropdown}>
            <a>
              <span>{user.name}</span>
              <img src={user.gravatar} />
            </a>
            <div className={styles.my_account_dropdown_menu} style={menuStyle}>
              <ul>
                <li className={styles.my_account_dropdown_menu_header}>Account</li>
                <li>
                  <Icon name="user" />
                  &nbsp;<Link to={'/account/details'}>Your Details</Link>
                </li>
                {!user.parent_user_id && (
                  <div>
                    <li>
                      <Icon name="code" />
                      &nbsp;<Link to={'/account/integrations'}>Integrations</Link>
                    </li>
                    {/*<li><Icon name="users" />&nbsp;<Link to={'/account/affiliate'}>Affiliate</Link></li>*/}
                    <li>
                      <Icon name="video" />
                      &nbsp;<Link to={'/account/videosettings'}>Video Settings</Link>
                    </li>
                    <li>
                      <Icon name="th-list" />
                      &nbsp;<Link to={'/customlists'}>Custom Lists</Link>
                    </li>
                    <li>
                      <Icon name="key" />
                      &nbsp;<Link to={'/account/credentials'}>API</Link>
                    </li>
                  </div>
                )}
              </ul>
              {!user.parent_user_id &&
                    <ul>
                        <li className={styles.my_account_dropdown_menu_header}>Support</li>
                        {/* <li><Icon name="graduation-cap" />&nbsp;<Link to={'/training'}>Training Videos</Link></li> */}
                         <li><Icon name="book" />&nbsp;<a href={externalLinks.docsLink} target="_blank">Docs</a></li>
                        <li><Icon name={['fab', 'facebook']} />&nbsp;<a href={externalLinks.facebook} target="_blank">Facebook Group</a></li>
                        <li><Icon name="life-ring" />&nbsp;<a href={externalLinks.docsLink} target="_blank">Help Desk</a></li>
                    </ul>
                }
              {user.superuser === 1 ? (
                <ul>
                  <li className={styles.my_account_dropdown_menu_header}>Admin</li>
                  <li>
                    <Icon name="lock" />
                    &nbsp;<Link to={'/admin'}>Manage Users</Link>
                  </li>
                </ul>
              ) : null}
              <ul>
                <li>
                  <Icon name="sign-out" />
                  &nbsp;<a onClick={this.logoutUser}>Logout</a>
                </li>
              </ul>
            </div>
          </div>
          
          
          {canUpgrade && (
            <div className={styles.upgrade_button}>
              <Button onClick={()=>window.location.href = 'http://special.interactr.io/interactr-club/a.html'} primary>
                Join The Club
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  }
}
