import React from 'react'
import styles from './NeedHelpBox.module.scss'
import Icon from "../../../components/Icon";
import Button from "../../../components/Buttons/Button";
import getAsset from "../../../utils/getAsset";
import LinkButton from "../../../components/Buttons/LinkButton";
import {trainingPath} from "../../training/routes";

const NeedHelpBox = () => {
  // Temp override util we have icons made
  const icon = getAsset('/img/img-need-help.png');

  return (
    <div className={styles.wrapper} style={{marginLeft: '25px'}}>
      <div className={'grid'}>
        <div className={'col3'} style={{padding: 0}}>
          <img src={icon} className={styles.icon}/>
        </div>
        <div className={'col9'}>
          <h3 style={{marginTop: 0}}>Need Help?</h3>
          <p>You can find in depth training videos on all aspects of how to use the app on our training videos page. </p>
          <p>If you still need help you can get in touch with us at any time by clicking the support button below</p>
          <Button icon={'life-ring'} onClick={() => Beacon('open')}>Support</Button><LinkButton  to={trainingPath()} icon={'graduation-cap'}>Training Videos</LinkButton>
        </div>
      </div>
    </div>
  )
};
export default NeedHelpBox;