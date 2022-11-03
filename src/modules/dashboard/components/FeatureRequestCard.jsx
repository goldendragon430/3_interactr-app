import React from 'react';
import LinkButton from 'components/Buttons/LinkButton'
import styles from './FeatureRequestCard.module.scss'
import cx from 'classnames';

const FeatureRequestCard = ()=>{

  return (
    <div className={cx('grid')}>
      <div className={cx('col12')}>
        <div className={styles.wrapper}>
          <div className="grid">
            <div className={cx('col7', styles.left)}>
              <h2>Want to view our upcoming features?</h2>
            </div>
            <div className={cx('col5', styles.right)}>
              <LinkButton
                href="https://shipright.community/interactr"
                primary
                icon={'external-link'}
                target="_blank"
              >
                Click to view our Feature Request List
              </LinkButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
};
export default FeatureRequestCard;