import React from 'react';
import styles from './DashboardPage.module.scss';
import {DifferenceSpan} from "../../agency/components/ClientSummaryStat";
import {numberWithCommas} from "../../../utils/numberUtils";
import getAsset from "../../../utils/getAsset";
import Icon from "../../../components/Icon";


export default function DashboardCard ({currentValue, previousValue, suffix = '', heading, loading = false, style, description, iconPath}) {

  // Temp override util we have icons made
    const icon = getAsset(iconPath);

    return (
      <div className={styles.statWrapper} style={style}>
        <div className={styles.statContent}>
          <h3
            style={{cursor: 'pointer'}}
            data-tip={description}
          >
            {heading} <Icon name={'info-circle'} />
          </h3>
          <h1>{ (loading) ? <Icon loading/> : numberWithCommas(currentValue) + suffix }</h1>
          <p><DifferenceSpan currentStat={currentValue}  previousStat={previousValue} loading={loading} /></p>
          {/*{*/}
          {/*  (loading) ?*/}
          {/*    'loading' :*/}
          {/*    <p className={styles.lastMonth}>Previous 30 Days {numberWithCommas(previousValue)}{suffix}</p>*/}
          {/*}*/}
        </div>
        <img src={icon} className={styles.statIcon}/>
      </div>
    );
}