import { startOfDay, getTime } from 'date-fns';

export default function (arrayToSort) {
  return arrayToSort.reduce((acc, task) => {
    const taskDay = getTime(startOfDay(task.timeTracking.startTimestamp));
    const newDayArray = Array.isArray(acc[taskDay]) ? acc[taskDay].concat([task]) : [task];

    return { ...acc, [taskDay]: newDayArray };
  }, {});
}
