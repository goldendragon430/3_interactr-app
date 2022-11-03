import React from 'react';
import styles from './MessageBox.module.scss';

const MessageBox = ({children, heading}) => {
  return (
    <div className={styles.wrapper}>
      {(!!heading) && <h3>{heading}</h3> }
      {children}
    </div>
  )
}
export default MessageBox;