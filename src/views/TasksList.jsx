import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';

// Components
import TimerCard from '../components/organisms/TimerCard';
import Timer from '../components/molecules/Timer';

// Hooks
import useRedmineApi from '../hooks/Api/useRedmineApi';
import useFileSystem from '../hooks/useFileSystem';

// Utils
import formatTimestamp from '../utils/formatTimestamp';
import sortTasksByDate from '../utils/sortTasksByDate';

const TasksList = () => {
  const [taskToTime, setTaskToTime] = useState(null);
  const [hasTimerStarted, setHasTimerStarted] = useState(false);
  const [startTimestamp, setStartTimestamp] = useState(0);
  const [getUnsyncTasks, setUnsyncTasks] = useFileSystem({
    src: 'unsync-tasks',
    defaults: {
      pending: {
        taskId: null,
        startTimestamp: null,
      },
      unsyncTasks: [],
    },
  });
  const [taskRequestState, taskPayload, taskError, { getTask }] = useRedmineApi();
  const [timeEntryRequestState, , timeEntryError, { postTimeEntry }] = useRedmineApi();
  const pendingTask = getUnsyncTasks('pending');
  const unsyncTasks = getUnsyncTasks('unsyncTasks');

  useEffect(() => {
    if (pendingTask && pendingTask.taskId) {
      setHasTimerStarted(true);
      setStartTimestamp(pendingTask.startTimestamp);
      getTask(pendingTask.taskId);
    } else if (!pendingTask && !unsyncTasks) setUnsyncTasks({});
  }, []);

  useEffect(() => {
    if (taskPayload) setTaskToTime(taskPayload.issues[0]);
  }, [taskPayload]);

  const handleTaskIdBlur = (e) => {
    const taskIdToSearch = e.target.value;
    if (taskIdToSearch) {
      getTask(taskIdToSearch);
    }
  };

  const handleTimerStart = () => {
    setHasTimerStarted(true);
    setStartTimestamp(Date.now());
    setUnsyncTasks('pending', { taskId: taskToTime.id, startTimestamp: Date.now() });
  };

  const handleTimerStop = () => {
    setHasTimerStarted(false);
    setTaskToTime(null);
    setStartTimestamp(0);
    setUnsyncTasks('pending', { taskId: null, startTimestamp: null });
    // Save tracked task in unsync array
    const newUnsyncTasks = unsyncTasks.concat([{
      ...taskToTime,
      timeTracking: {
        startTimestamp,
        endTimestamp: Date.now(),
      },
    }]);
    setUnsyncTasks('unsyncTasks', newUnsyncTasks);
  };

  const handleOnSyncClick = () => {
    unsyncTasks.forEach((taskToSync) => {
      postTimeEntry(taskToSync);
    });
  };

  return (
    <div>
      <TimerCard
        handleTaskIdBlur={handleTaskIdBlur}
        task={taskToTime}
        disabled={taskRequestState === 'loading' || hasTimerStarted}
        error={taskError
          || ((taskPayload && taskPayload.total_count === 0)
            ? 'No task found with this id'
            : null
          )}
      >
        <Timer
          handleStart={handleTimerStart}
          handleStop={handleTimerStop}
          disabled={!taskToTime}
          startTimestamp={startTimestamp}
        />
      </TimerCard>

      {unsyncTasks.length > 0
        ? (
          <ul>
            {Object.keys(sortTasksByDate(unsyncTasks)).map((tasksDay) => (
              <li key={tasksDay}>
                <span>{format(parseInt(tasksDay, 10), 'EEEE dd MMMM')}</span>
                <ul>
                  {sortTasksByDate(unsyncTasks)[tasksDay].map((unsyncTask) => (
                    <li key={unsyncTask.timeTracking.endTimestamp}>
                      <span>{`#${unsyncTask.id}`}</span>
                      <span>{unsyncTask.subject}</span>
                      <span>
                        {formatTimestamp(
                          unsyncTask.timeTracking.endTimestamp - unsyncTask.timeTracking.startTimestamp,
                        )}
                      </span>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        )
        : <div>Start your day with a task</div>}
      <button type="button" onClick={handleOnSyncClick}>Sync my tasks</button>
    </div>
  );
};

export default TasksList;
