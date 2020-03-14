export default function (msToChange) {
  const msRoundedToNextQuarter = Math.ceil(msToChange / 900000) * 900000;
  return (msRoundedToNextQuarter / (1000 * 3600)).toFixed(2);
}
