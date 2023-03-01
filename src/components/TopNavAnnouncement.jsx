import React from 'react';
import LinkButton from './Buttons/LinkButton';
import styles from './TopNavAnnouncement.module.scss';

const TopNavAnnouncemnt = ({ text, url, linkText, noButton, onClose, name, className }) => {
  return (
    <div className={styles.announcement} >

      <span style={{marginRight:10}} >
        {text} {noButton && <a href={url} style={{fontWeight:'bold'}}>{linkText}</a>}
      </span>
      { !noButton && <LinkButton to={url}>{linkText}</LinkButton>}

      <a className={styles.hideforever} onClick={
        function neverShowAgain(e){
          e.preventDefault()
          onClose()
          localStorage.setItem(`hide-announcement`, name)
        }
      }>I Got it! Never show it again.</a>
    </div>
  );
};

export default TopNavAnnouncemnt;
