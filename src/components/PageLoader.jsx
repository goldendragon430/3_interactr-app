import cx from 'classnames';
import Icon from 'components/Icon';
import React from 'react';
import styles from './PageLoader.module.scss';


const PageLoader = ()=>{
  return(
    <div className={cx(styles.wrapper, styles.in)}>
      <div className={styles.inner}>
        {/* <Icon icon="circle-notch" spin size="4x" />
            <Icon icon="spinner" spin size="4x" /> */}
        <Icon icon="spinner-third"   size="4x" className={styles.icon}/>
        <p>Loading...</p>
      </div>
    </div>
  )
};
export default PageLoader;
