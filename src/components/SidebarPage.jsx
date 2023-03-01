import React from 'react';
import styles from './SidebarPage.module.scss';

export default class SidebarPage extends React.Component {
  render(){
    const {aside, main} = this.props;

    return(
      <div className={styles.wrapper}>
        <div className={styles.aside}>
          {aside}
        </div>
        <div className={styles.main}>
          {main}
        </div>
      </div>
    )
  }
}