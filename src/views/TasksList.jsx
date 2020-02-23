import React, { useEffect, useState } from 'react';
import {
  format, getTime, parseISO, isAfter,
} from 'date-fns';

// Components
import TimerCard from '../components/organisms/TimerCard';
import Timer from '../components/molecules/Timer';
import TimeDatesForm from '../components/forms/TimeDatesForm';
import TimedTaskCard from '../components/molecules/TimedTaskCard';
import DayCard from '../components/organisms/DayCard';

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
  const [unsyncTasks, setUnsyncTasksState] = useState(0);
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

  useEffect(() => {
    setUnsyncTasksState(getUnsyncTasks('unsyncTasks'));

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
        id: Math.random().toString(36).substring(2, 15) + Math.random(),
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

  const handleTimestampChange = (e) => {
    const splitedInputName = e.target.name.split('-');
    const taskTimmerId = splitedInputName[0];
    const side = splitedInputName[1];
    const newTimestamp = getTime(parseISO(e.target.value));

    const updatedUnsyncTasks = unsyncTasks.map((unsyncTask) => {
      const isEndAfterStart = isAfter(
        side === 'endTimestamp' ? newTimestamp : unsyncTask.timeTracking.endTimestamp,
        side === 'startTimestamp' ? newTimestamp : unsyncTask.timeTracking.startTimestamp,
      );
      if ((unsyncTask.timeTracking.id === taskTimmerId) && isEndAfterStart) {
        return {
          ...unsyncTask,
          timeTracking: {
            ...unsyncTask.timeTracking,
            [side]: newTimestamp,
          },
        };
      }
      return unsyncTask;
    });

    // Update on local and on state to refresh the view
    setUnsyncTasks('unsyncTasks', updatedUnsyncTasks);
    setUnsyncTasksState(updatedUnsyncTasks);
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

      {unsyncTasks && unsyncTasks.length > 0
        ? (
          <div className="px-2">

            <ul>
              {Object.keys(sortTasksByDate(unsyncTasks)).map((tasksDay) => (
                <DayCard
                  key={tasksDay}
                  title={format(parseInt(tasksDay, 10), 'EEEE dd MMMM')}
                >
                  <ul>
                    {sortTasksByDate(unsyncTasks)[tasksDay].map((unsyncTask) => (
                      <TimedTaskCard key={unsyncTask.timeTracking.id}>
                        <div className="flex flex-col">
                          <span className="font-bold">
                            {`#${unsyncTask.id} - ${unsyncTask.subject}`}
                          </span>
                          <span className="italic text-sm">{unsyncTask.project.name}</span>
                          <TimeDatesForm
                            initValues={{
                              startTimestamp: format(new Date(unsyncTask.timeTracking.startTimestamp), "yyyy-MM-dd'T'HH:mm"),
                              endTimestamp: format(new Date(unsyncTask.timeTracking.endTimestamp), "yyyy-MM-dd'T'HH:mm"),
                            }}
                            handleBlur={handleTimestampChange}
                            timeTrackingId={unsyncTask.timeTracking.id}
                          />
                        </div>
                        <span className="text-lg">
                          {formatTimestamp(
                            unsyncTask.timeTracking.endTimestamp - unsyncTask.timeTracking.startTimestamp,
                          )}
                        </span>
                      </TimedTaskCard>
                    ))}
                  </ul>
                </DayCard>
              ))}
            </ul>

            <button
              className={`
          mt-2 w-full bg-teal-300 hover:bg-teal-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline border-b-4 border-teal-500 hover:border-teal-300
          `}
              type="button"
              onClick={handleOnSyncClick}
            >
              {`Sync ${unsyncTasks.length} tasks`}
            </button>
          </div>
        )
        : <div>Start your day with a task</div>}
    </div>
  );
};

export default TasksList;
