import React from 'react';
import cx from 'classnames';

import { Button } from 'components/Buttons';

import styles from './SourceMedia.module.scss';
import CardStyles from 'components/Card.module.scss';

export const NodeSourceMediaListItem = ({ media, onChange, saving }) => {
  // No longer show youtube here as its not supported
  if(media.stream_url) return null;

  return(
    <div className="col3" style={{height: '125px', marginBottom: '30px'}}>
      <div className={cx(CardStyles.Card, styles.itemCard)}>
        <Button primary small icon="plus" saving={saving} onClick={()=>onChange(media.id)}>Select</Button>
        <img src={media.thumbnail_url}  className="img-fluid" />
        <p className={styles.title} style={{marginTop: '10px'}}>{media.name}</p>
      </div>
    </div>
  )
};