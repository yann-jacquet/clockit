import React, { useEffect, useState } from 'react';

// Components
import TimerCard from '../components/organisms/TimerCard';
import Timer from '../components/molecules/Timer';

// Hooks
import useRedmineApi from '../hooks/Api/useRedmineApi';
import useFileSystem from '../hooks/useFileSystem';

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
    // TODO: save tracked task in unsync array
    console.log({
      start: startTimestamp,
      end: Date.now(),
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
    </div>
  );
};

export default TasksList;
