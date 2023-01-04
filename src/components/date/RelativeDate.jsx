import React from 'react';
// import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import moment from 'moment';

export default function RelativeDate({date}) {
  return date ? moment.utc(date).fromNow(): 'N/A';
}
