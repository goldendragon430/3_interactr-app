import React from 'react';
import {getGreetingTime} from "../../../utils/timeUtils";
import moment from "moment";
import styles from './WelcomeMessage.module.scss'
import {avatar} from "../../../utils/helpers";
import ReactTooltip from "react-tooltip";
import Icon from "../../../components/Icon";

const WelcomeMessage = ({user}) => {
  return (
    <div className={styles.wrapper}>
      <ReactTooltip  className="tooltip" />
      <div className={styles.avatar}>
        <img src={avatar(user)} className={'img-fluid'}/>
      </div>
      <div className={styles.text}>
        <h1>{getGreetingTime(moment())} {user.name}</h1>
        <p
          style={{cursor: 'pointer'}}
          data-tip={'For performance purposes we only show stats for your 10 newest projects'}
        >
          <Icon name={'info-circle'} />
          Here are your stats for the last 30 days
        </p>
      </div>
    </div>
  )
}

export default WelcomeMessage;