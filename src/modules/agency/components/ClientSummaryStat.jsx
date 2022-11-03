import React, {useEffect, useState} from 'react';
import Icon from "../../../components/Icon";
import percentDiff from 'percentage-difference'
import {isValidNumber, numberWithCommas} from "../../../utils/numberUtils";
import isNaN from "lodash/isNaN";

const ClientSummaryStat = ({loading, currentStat, previousStat, label, suffix= ''}) => {
  return (
    <div>
      <small>{label}</small>
      <br/>
      <h3 style={{margin: '5px 0'}}>
          <strong>
          {(loading) ? <Icon loading /> : numberWithCommas(currentStat) + suffix}
          </strong>
        <br/>
        {/*<br/>*/}
        {/*from {(loading) ? <Icon loading /> : {previousStat}}*/}
        <DifferenceSpan currentStat={currentStat}  previousStat={previousStat} loading={loading} />
      </h3>
    </div>
  )
}
export default ClientSummaryStat;

export const DifferenceSpan = ({loading, previousStat, currentStat, fontSize = 11}) => {
  if(loading) return null;

  let diff = 0;

  if( ! isValidNumber(previousStat) && ! isValidNumber(currentStat)) {
    // Both numbers are invalid so just return a -
    return (
      <small style={{ fontSize: fontSize + 'px'}}>
        - %
      </small>
    )
  }
  else if ( ! isValidNumber(previousStat) )  {
    // If previous months views are 0 and this months views are 240 then the value should be 240%
    diff = currentStat;
  }
  else if( ! isValidNumber(currentStat) ) {
    // The current stat is invalid but we have previous data so stat should be a decrease of 100%
    diff = -100;
  }
  else if(previousStat===0 && currentStat===0) {
    diff = 0;
  }
  else if(previousStat === 0) {
    diff = currentStat;
  }
  else if (currentStat === 0) {
    return (
      <small style={{ fontSize: fontSize + 'px'}}>
        - %
      </small>
    )
  }
  else {
    diff = percentDiff(previousStat, currentStat,true)
  }


  let styles = {
    //paddingLeft: '10px',
    fontSize: fontSize + 'px'
  }

  let icon = null; // this is if diff == 0

  if(diff > 0) {
    icon = 'arrow-up';
    styles.color = '#41c186';
  }
  else if(diff < 0 ) {
    icon = 'arrow-down';
    styles.color = '#ff6961';
  }

  return (
    <small style={styles}>
      {(!! icon ? <Icon  name={icon} style={{marginRight: 0}}/> : "= ")} {diff}%
    </small>
  )
}