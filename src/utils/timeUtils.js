export function secondsFromTime(timeString, min, max) {
  let [m, s, ms] = timeString.split(':').map(str => parseInt(str, 10));
  let [mString, sString, msString] = timeString.split(':');

  if (isNaN(ms)) {
    ms = 0;
  }

  if (isNaN(s)) {
    s = 0;
  }

  if (isNaN(m)) {
    m = 0;
  }

  ms = parseFloat("0."+msString);

  const seconds = ((m * 60) + s) + ms;

  if(seconds < min) return min;

  if(seconds > max) return max;

  return seconds;
}

export function timeFromSeconds(seconds) {
  if (!seconds) {
    return "00:00:000";
  }

  const minutesBeforeFormat = Math.floor(seconds / 60); // 2
  const m = minutesBeforeFormat.toString().padStart(2, 0);

  const leftOverSeconds = seconds - (minutesBeforeFormat * 60); // 50.2

  const secondsBeforeFormat = Math.floor(leftOverSeconds); // 50
  const s = secondsBeforeFormat.toString().padStart(2, 0);

  const secondSplit = seconds.toString().split(".");
  let ms = "";
  if (secondSplit[1] === undefined) {
      ms = "000";
  } else {
      ms = secondSplit[1].substr(0, 3).padEnd(3, "0");
  }

  return `${m}:${s}:${ms}`;
}

export const getGreetingTime = (currentTime) => {
  if (!currentTime || !currentTime.isValid()) { return 'Hello'; }

  const splitAfternoon = 12; // 24hr time to split the afternoon
  const splitEvening = 17; // 24hr time to split the evening
  const currentHour = parseFloat(currentTime.format('HH'));

  if (currentHour >= splitAfternoon && currentHour <= splitEvening) {
    // Between 12 PM and 5PM
    return 'Good afternoon';
  } else if (currentHour >= splitEvening) {
    // Between 5PM and Midnight
    return 'Good evening';
  }
  // Between dawn and noon
  return 'Good morning';
}

export const delay = (delayTime) => {
  return new Promise( res => setTimeout(res, delayTime) );
}