import React from 'react';
import styles from './Upgrade.module.scss';
import {Link} from 'react-router-dom';

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
