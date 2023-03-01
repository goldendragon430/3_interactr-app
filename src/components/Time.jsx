import React from 'react';
import { timeFromSeconds } from "../utils/timeUtils";
export default function Time({s}) {
  return (
    <span>
      {timeFromSeconds(s)}
    </span>
  );
}
