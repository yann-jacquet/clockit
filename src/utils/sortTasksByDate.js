import { startOfDay, getTime } from 'date-fns';
import { memoize } from 'lodash';

export default memoize((arrayToSort) => arrayToSort.reduce((acc, task) => {
  const taskDay = getTime(startOfDay(task.timeTracking.startTimestamp));
  const hasDate = acc[taskDay] && true;
  // Build tasks array
  const previousTasksArray = hasDate ? acc[taskDay].tasksByDay : [];
  const tasksByDay = previousTasksArray.concat([task]);
  // Compute total timed tracked
  const previousTotal = hasDate ? acc[taskDay].totalTracked : 0;
  const totalTracked = previousTotal
      + (task.timeTracking.endTimestamp - task.timeTracking.startTimestamp);

  return { ...acc, [taskDay]: { tasksByDay, totalTracked } };
}, {}));
