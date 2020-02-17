export default function (duration) {
  // const duration = Date.now() - startTimestamp;
  const seconds = Math.floor((duration / 1000) % 60);
  const minutes = Math.floor((duration / (1000 * 60)) % 60);
  const hours = Math.floor((duration / (1000 * 60 * 60)) % 24);
  const formated = {
    hours: (hours < 10) ? `0${hours}` : hours,
    minutes: (minutes < 10) ? `0${minutes}` : minutes,
    seconds: (seconds < 10) ? `0${seconds}` : seconds,
  };

  return `${formated.hours}:${formated.minutes}:${formated.seconds}`;
}
