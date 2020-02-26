import React from 'react';
import PropTypes from 'prop-types';

const TimerCard = ({
  handleTaskIdBlur, task, disabled, error, children,
}) => (
  <div className="w-full shadow bg-white py-2 px-3 flex flex-row items-center sticky top-0">
    <div className="flex-grow flex flex-col text-gray-700">
      <label htmlFor="taskId" className="w-1/2 flex flex-row text-gray-700 text-sm font-bold">
        #
        <input
          className="flex-grow appearance-none text-gray-700 leading-tight focus:outline-none"
          type="text"
          placeholder="Task id"
          name="taskId"
          onBlur={handleTaskIdBlur}
          disabled={disabled}
          defaultValue={task ? task.id : undefined}
        />
      </label>
      {error
        ? <span className="text-red-500">{error}</span>
        : null}
      {task
        ? (
          <>
            <span className="font-bold">{task.subject}</span>
            <span className="italic text-sm">{task.project.name}</span>
            <span className="italic text-sm">
              {task.assigned_to ? `Assignee : ${task.assigned_to.name}` : 'Nobody Assigned'}
            </span>
          </>
        )
        : null}
    </div>
    <div>
      {children}
    </div>
  </div>
);

TimerCard.propTypes = {
  handleTaskIdBlur: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
  task: PropTypes.shape({

  }),
  disabled: PropTypes.bool,
  error: PropTypes.string,
};

TimerCard.defaultProps = {
  task: null,
  disabled: false,
  error: null,
};

export default TimerCard;
