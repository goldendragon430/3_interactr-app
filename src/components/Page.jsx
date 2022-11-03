import React from 'react';
import styles from './Page.module.scss';

class Page extends React.Component {
  constructor({user}) {
    super(...arguments);
  }


  render() {
    const {user, children} = this.props;

    return (
      <div className={styles.page_wrapper}>
        {children}
      </div>
    );
  }
}

export default Page;
