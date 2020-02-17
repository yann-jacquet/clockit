import React, { useEffect, useState } from 'react';

// Components
import TimerCard from '../components/organisms/TimerCard';
import Timer from '../components/molecules/Timer';

// Hooks
import useRedmineApi from '../hooks/Api/useRedmineApi';

const TasksList = () => {
  const [taskToTime, setTaskToTime] = useState(null);
  const [taskRequestState, taskPayload, taskError, { getTask }] = useRedmineApi();

  useEffect(() => {
    if (taskPayload) setTaskToTime(taskPayload.issues[0]);
  }, [taskPayload]);

  const handleTaskIdBlur = (e) => (e.target.value ? getTask(e.target.value) : null);

  return (
    <div>
      <TimerCard
        handleTaskIdBlur={handleTaskIdBlur}
        task={taskToTime}
        disabled={taskRequestState === 'loading'}
      >
        <Timer
          handleStop={(res) => console.log('stop timer : ', res)}
          disabled={!taskPayload}
        />
      </TimerCard>
    </div>
  );
};

export default TasksList;
