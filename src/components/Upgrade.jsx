import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Upgrade.module.scss';

export default function ({text, url}) {
    const btnText = 'Click Here To Upgrade';

    return(
      <div className={styles.wrapper}>
        <div>
          <h2>Feature Unavailable</h2>
          <p>{text || 'You must upgrade to use this feature'}</p>
          <p>
              {
                  <Link to="/upgrade">Click here to upgrade</Link>
              }
          </p>
        </div>
      </div>
    );
}
