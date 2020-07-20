const formatTimeNumber = (numberToFormat) =>
  numberToFormat < 10 ? `0${numberToFormat}` : numberToFormat;

export default function (duration) {
  const seconds = Math.floor((duration / 1000) % 60);
  const minutes = Math.floor((duration / (1000 * 60)) % 60);
  const hours = Math.floor((duration / (1000 * 60 * 60)) % 24);
  const days = Math.floor(duration / (1000 * 86400));

  return `${formatTimeNumber(hours + days * 24)}:${formatTimeNumber(
    minutes
  )}:${formatTimeNumber(seconds)}`;
}
