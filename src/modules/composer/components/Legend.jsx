import React, { useEffect } from 'react'
import styles from './legend.module.scss'
import Icon from 'components/Icon'
import getAsset from 'utils/getAsset';
import {useReactiveVar} from "@apollo/client";
import {getWhitelabel} from "../../../graphql/LocalState/whitelabel";


const Legend = ()=>{
  const whitelabel = useReactiveVar(getWhitelabel);


  const whitelableStyle = (whitelabel) ? {
    backgroundColor: whitelabel.primary_color,
    color: 'white'
  } : {};

  return(
    <ul className={styles.wrapper}>
      <li className={styles.item} data-tip="Is the First Video of the Project. Drag this to change the start video">
        <div className={styles.image}>
          <div className={styles.startPosition}>
            <p>S</p>
          </div>
        </div>
        <div className={styles.text}>
          <p>Start Video</p>
        </div>
      </li>
      <li className={styles.item} data-tip="Shows the direction of the video along the path">
        <div className={styles.image}>
          <img src={getAsset("/img/connector-arrow.png")} />
        </div>
        <div className={styles.text}>
          <p>Connector</p>
        </div>
      </li>
      <li className={styles.item} data-tip="Shows path to video's menu node">
        <div className={styles.image}>
          <img src={getAsset("/img/green-connector.png")} style={{marginTop: '4px', height:'9px'}}/>
        </div>
        <div className={styles.text}>
          <p>Video End Path</p>
        </div>
      </li>
      <li className={styles.item} data-tip="Shows connections from elements inside the node that have 'Play Node' as as action">
        <div className={styles.image}>
          <img src={getAsset("/img/blue-connector.png")} style={{marginTop: '4px'}}/>
        </div>
        <div className={styles.text}>
          <p>Element Click Path</p>
        </div>
      </li>
    </ul>
  )
};
export default React.memo(Legend);



