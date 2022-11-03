import React from 'react';
import CalendarCard from "./CalendarCard";
import styles from './CalendarMonth.module.scss'

const CalendarMonth = ({options}) => {

  const {year, month, niche, items} = options;

  return(
    <div className={styles.wrapper} style={{marginBottom: '30px'}}>
      <div className={styles.aside} style={{paddingRight: 0}}>
        <div className={styles.headline}>
          <div>
            <h1>{month}</h1>
            <h3>{year}</h3>
          </div>
        </div>
      </div>
      <div className={styles.body}>
        <h1 className={styles.niche}>{niche}</h1>
        <div>
          {items.map(item=><CalendarCard item={item} />)}
        </div>
      </div>
    </div>
  )
};
export default CalendarMonth;