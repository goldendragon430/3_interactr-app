import React, { useState } from 'react';
import styles from './Card.module.scss';
import ReactTooltip from 'react-tooltip';
import cx from 'classnames';
import Icon from 'components/Icon';
import getAsset from "../utils/getAsset";
import times from 'lodash/times';
import { AnimatePresence, motion } from 'framer-motion';


export default function Card({
  button,
  thumbnail,
  heading,
  subHeading,
  meta,
  actions,
  migrationLabel
}) {
  
  const [isHovered, setHovered] = useState(false);

  return (
    <div 
      className={styles.Card} 
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <ReactTooltip />

      {!!thumbnail && (
        <div className={styles.image}>
          <div className={styles.thumbnailsWrapper}>
            <Thumbnails
              images={thumbnail}
              className={cx(styles.cardThumbnail, { [styles.single]: !Array.isArray(thumbnail) })}
            />
            <AnimatePresence>
              {isHovered && (
                <motion.article
                  className={cx(styles.previewIcon)}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  { button }
                </motion.article>
              )}
            </AnimatePresence>
         </div>
        </div>
      )}

      <div className={cx(styles.content)}>
        <div className={styles.info}>
          {heading && <h4 className={styles.title}>{heading}</h4>}
          <div className = {styles.subHeading} >
            {subHeading && <h4 className={styles.small_title}>{subHeading}</h4>}
            {migrationLabel && <h4 className={styles.migratingTitle}>{migrationLabel}</h4>}
          </div>
        </div>
        <div className={styles.actionsBar}>
          <div className={styles.meta}>
            { (!!meta) && meta }
          </div>
          <div className={styles.actions}>
            { (!!actions) && actions}
          </div>
        </div>
      </div>
    </div>
  );
}

function Thumbnails({ images, className }) {

  if(! Array.isArray(images)) {
    return  <img src={images || getAsset('/img/no-thumb.jpg')} className={className} alt="thumbnail" style={{ boxShadow: 'rgb(0 0 0 / 6%) 0px 2px 20px' }} />;
  }

  return (images.length) ? (
    images.map( (url, index) => { 
      return (
        <div className={className} alt="thumbnail">
          <div style={{position: 'relative', height: '100%', paddingBottom: '56.25%', display: 'flex', justifyContent: 'center', backgroundColor: '#eee', borderRadius: '7px'}}>
            <img
              src={(url.length) ? url : getAsset('/img/no-thumb.jpg')}
              key={index}
              style={{position: 'absolute', top: 0, height: '100%', borderRadius: '7px'}}
            />
          </div>
        </div>
      )
    })
  ) :
    times(4, (index)=> <img src={getAsset('/img/no-thumb.jpg')} className={className} alt="thumbnail"  key={index} /> );
}