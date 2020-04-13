import React, { useEffect, useState } from 'react';
import { format, getTime, parseISO, isAfter } from 'date-fns';

// Components
import TimerCard from '../components/organisms/TimerCard';
import Timer from '../components/molecules/Timer';
import TimeDatesForm from '../components/forms/TimeDatesForm';
import TimedTaskCard from '../components/molecules/TimedTaskCard';
import DayCard from '../components/organisms/DayCard';
import BottomModal from '../components/organisms/BottomModal/BottomModal';

// Hooks
import useRedmineApi from '../hooks/Api/useRedmineApi';
import useFileSystem from '../hooks/useFileSystem';
import useTimer from '../hooks/useTimer';

// Utils
import formatTimestamp from '../utils/formatTimestamp';
import sortTasksByDate from '../utils/sortTasksByDate';
import isRedmineTask from '../utils/isRedmineTask';
import TaskCardContent from '../components/molecules/TaskCardContent/TaskCardContent';

const TasksList = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [pendingTask, setPendingTask] = useState(null);
  const [trackingMode, setTrackingMode] = useState('withId'); // withId || withName
  const [unsyncTasks, setUnsyncTasks] = useState([]);
  const [getLocalFile, setLocalFile] = useFileSystem({
    src: 'unsync-tasks',
    defaults: {
      pending: null,
      unsyncTasks: [],
    },
  });
  const { timerState, startTimer, stopTimer, getTimerTimestamps } = useTimer();
  const [taskRequestState, taskPayload, taskError, { getTask }] = useRedmineApi();
  const [timeEntryRequestState, , timeEntryError, { postTimeEntry }] = useRedmineApi();

  useEffect(() => {
    // On mount should initialize with pending task and tasks waiting for sync
    const localPendingTask = getLocalFile('pending');
    const localUnsyncTasks = getLocalFile('unsyncTasks');

    if (localPendingTask) {
      setTrackingMode(isRedmineTask(localPendingTask) ? 'withId' : 'withName')
      setPendingTask(localPendingTask)
      startTimer(localPendingTask.startTimestamp)
    }

    if (localPendingTask && isRedmineTask(localPendingTask)) {
      getTask(localPendingTask.taskId)
    }

    if (localUnsyncTasks) setUnsyncTasks(localUnsyncTasks)
  }, []);

  useEffect(() => {
    if (taskPayload) setPendingTask(taskPayload.issues[0]);
  }, [taskPayload]);

  const handleTimerCardInputBlur = e => {
    if (trackingMode === 'withId' && e.target.value) {
      getTask(e.target.value);
    } else if (trackingMode === 'withName' && e.target.value) {
      setPendingTask({
        id: null,
        subject: e.target.value,
        assigned_to: null,
        project: null,
      });
    }
  };

  const handleTimerStart = () => {
    const taskToSave = {
      taskId: trackingMode === 'withId' ? pendingTask.id : null,
      subject: pendingTask.subject,
      startTimestamp: Date.now(),
    };

    startTimer();
    setLocalFile('pending', taskToSave);
  };

  const handleTimerStop = () => {
    stopTimer();
    // Save tracked task in unsync array
    const newUnsyncTasks = unsyncTasks.concat([
      {
        ...pendingTask,
        timeTracking: {
          id:
            Math.random()
              .toString(36)
              .substring(2, 15) + Math.random(),
          startTimestamp: getTimerTimestamps().start,
          endTimestamp: Date.now(),
        },
      },
    ]);

    // Clear from local pending task and add it to unsync array
    setPendingTask(null);
    setLocalFile('pending', null);
    setLocalFile('unsyncTasks', newUnsyncTasks);
    setUnsyncTasks(newUnsyncTasks);
  };

  const handleOnSyncClick = () => {
    const requests = [];
    const succeededSyncIds = [];

    unsyncTasks
      .filter((taskToSync) => isRedmineTask(taskToSync))
      .forEach((taskToSync) => {
        requests.push(
          postTimeEntry(taskToSync).then(
            (res) => res && res.status === 201 && succeededSyncIds.push(taskToSync.id)
          )
        );
      });

    Promise.all(requests).then(() => {
      // Clean sync tasks from array
      const stillWaitingToSync = unsyncTasks.filter((task) => (
        !succeededSyncIds.includes(task.id)
        || !isRedmineTask(task)
      ));

      setUnsyncTasks(stillWaitingToSync);
      setLocalFile('unsyncTasks', stillWaitingToSync);
    });
  };

  const handleTimestampChange = e => {
    const splitedInputName = e.target.name.split('-');
    const taskTimmerId = splitedInputName[0];
    const side = splitedInputName[1];
    const newTimestamp = getTime(parseISO(e.target.value));

    const updatedUnsyncTasks = unsyncTasks.map(unsyncTask => {
      const isEndAfterStart = isAfter(
        side === 'endTimestamp' ? newTimestamp : unsyncTask.timeTracking.endTimestamp,
        side === 'startTimestamp' ? newTimestamp : unsyncTask.timeTracking.startTimestamp
      );
      if (unsyncTask.timeTracking.id === taskTimmerId && isEndAfterStart) {
        return {
          ...unsyncTask,
          timeTracking: {
            ...unsyncTask.timeTracking,
            [side]: newTimestamp
          }
        };
      }
      return unsyncTask;
    });

    // Update on local and on state to refresh the view
    setLocalFile('unsyncTasks', updatedUnsyncTasks);
    setUnsyncTasks(updatedUnsyncTasks);
  };

  const handleSwitchClick = () => {
    // re-init task and switch mode
    setPendingTask(null)
    setTrackingMode(prevState => (prevState === 'withId' ? 'withName' : 'withId'));
  }

  const buildDayCardList = () => {
    const sortedTasksByDate = sortTasksByDate(unsyncTasks);
    const datesArray = Object.keys(sortedTasksByDate);

    return datesArray.sort().map(tasksDay => (
      <DayCard
        key={tasksDay}
        title={format(parseInt(tasksDay, 10), 'EEEE dd MMMM')}
        dayTotalTracked={formatTimestamp(sortedTasksByDate[tasksDay].totalTracked)}
      >
        <ul>
          {sortedTasksByDate[tasksDay].tasksByDay.map(unsyncTask => (
            <TimedTaskCard key={unsyncTask.timeTracking.id} isNonIdTask={!isRedmineTask(unsyncTask)} onLinkIDClick={() => setIsModalVisible(true)}>
              <TaskCardContent
                isNonIdTask={!isRedmineTask(unsyncTask)}
                task={unsyncTask}
                handleDatesBlur={handleTimestampChange}
              />
            </TimedTaskCard>
          ))}
        </ul>
      </DayCard>
    ));
  };

  return (
    <div>
      <TimerCard
        onInputBlur={handleTimerCardInputBlur}
        task={pendingTask}
        disabled={taskRequestState === 'loading' || (trackingMode === 'withId' && timerState === 'running')}
        error={
          taskError ||
          (taskPayload && taskPayload.total_count === 0 ? 'No task found with this id' : null)
        }
        trackingMode={trackingMode}
        onSwitchClick={handleSwitchClick}
        disableSwitch={taskRequestState === 'loading' || timerState === 'running'}
      >
        <Timer
          timerState={timerState}
          handleStart={handleTimerStart}
          handleStop={handleTimerStop}
          disabled={!(pendingTask && pendingTask.subject)}
          startTimestamp={getTimerTimestamps().start}
        />
      </TimerCard>

      {unsyncTasks && unsyncTasks.length > 0 ? (
        <div className="px-2">
          <ul>{buildDayCardList()}</ul>

          {unsyncTasks.filter(task => isRedmineTask(task)).length > 0
            ? (
              <button
                className={`
              mt-2 w-full bg-teal-300 hover:bg-teal-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline border-b-4 border-teal-500 hover:border-teal-300
              `}
                type="button"
                onClick={handleOnSyncClick}
              >
                {`Sync ${unsyncTasks.filter(task => isRedmineTask(task)).length} tasks`}
              </button>
            )
            : null}
        </div>
      ) : (
          <div className="mt-4 text-gray-500 w-full text-center italic">
            Start your day with a task
          </div>
        )}

      <BottomModal isVisible={isModalVisible}>
        Hello I am a modal
        <button onClick={() => setIsModalVisible(false)}>Close</button>
      </BottomModal>
    </div>
  );
};

export default TasksList;
