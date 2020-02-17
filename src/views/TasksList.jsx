import React from 'react';

// Components
import TimerCard from '../components/organisms/TimerCard';
import Timer from '../components/molecules/Timer';

// Hooks
import useRedmineApi from '../hooks/Api/useRedmineApi';

const TasksList = () => {
  const [taskRequestState, taskPayload, taskError, { getTask }] = useRedmineApi();

  const handleTaskIdBlur = (e) => (e.target.value ? getTask(e.target.value) : null);

  return (
    <div>
      <TimerCard
        handleTaskIdBlur={handleTaskIdBlur}
        task={taskPayload ? taskPayload.issues[0] : null}
      >
        <Timer
          disabled={!taskPayload}
        />
      </TimerCard>
    </div>
  );
};

export default TasksList;
