import React from 'react';
import styles from './Notification.module.scss';

@connect(topNavSelector, {})
export default class Notification extends React.Component{
  render(){
    const {children, user} = this.props;
    if (! children) {
      return null;
    }

    if (user.parent_user_id !== 0){
      return null;
    }

    return <div className={styles.wrapper}>{children}</div>;
  }
}
