import React from "react";
import PropTypes from "prop-types";

// Components
import TimeDatesForm from "../../forms/TimeDatesForm";

// Utils & misc
import formatForDateInput from "../../../utils/formatForDateInput";
import formatTimestamp from "../../../utils/formatTimestamp";

const TaskCardContent = ({ task, handleDatesBlur, isNonIdTask }) => (
  <>
    <div className="flex flex-col">
      {!isNonIdTask ? (
        <>
          <span className="font-bold">{`#${task.id} - ${task.subject}`}</span>
          <span className="italic text-sm">{task.project.name}</span>
        </>
      ) : (
        <span className="font-bold">{task.subject}</span>
      )}
      <TimeDatesForm
        isNonIdTask={isNonIdTask}
        initValues={{
          startTimestamp: formatForDateInput(task.timeTracking.startTimestamp),
          endTimestamp: formatForDateInput(task.timeTracking.endTimestamp),
        }}
        handleBlur={handleDatesBlur}
        timeTrackingId={task.timeTracking.id}
      />
    </div>
    <span className="w-full text-right text-lg">
      {formatTimestamp(
        task.timeTracking.endTimestamp - task.timeTracking.startTimestamp
      )}
    </span>
  </>
);

TaskCardContent.propTypes = {
  task: PropTypes.shape({}).isRequired,
  handleDatesBlur: PropTypes.func.isRequired,
  isNonIdTask: PropTypes.bool,
};

TaskCardContent.defaultProps = {
  isNonIdTask: false,
};

export default TaskCardContent;
