import React from 'react';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';

export default function RelativeDate({date}) {
  return date ? <span>{formatDistanceToNow(
      new Date(date.replace(/-/g, '/') // This formats the date for all browsers safari doesn't support dates with "-"
      ), {addSuffix:true})}</span> : 'N/A';
}
