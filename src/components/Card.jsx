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
  actions
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
          {subHeading && <h4 className={styles.small_title}>{subHeading}</h4>}
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
    images.map( (url, index) => <img
      src={(url.length) ? url : getAsset('/img/no-thumb.jpg')}
      key={index}
      className={className} alt="thumbnail"
    />)
  ) :
    times(4, (index)=> <img src={getAsset('/img/no-thumb.jpg')} className={className} alt="thumbnail"  key={index} /> );
}