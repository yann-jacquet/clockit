import React, { useState } from 'react';
import PropTypes from 'prop-types';

const TimerCard = ({
  onTaskIdBlur, onTaskNameChange, onSwitchClick, switchState, nameValue, task, disabled, error, children,
}) => (
  <div className="w-full shadow bg-white py-2 px-3 flex flex-row items-center sticky top-0">
    <div className="flex-grow flex flex-col text-gray-700">
      <div htmlFor="taskId" className="w-1/2 flex flex-row text-gray-700 text-sm font-bold">
        <button
          className="mr-1 bg-gray-300 hover:bg-gray-500 text-sm text-gray-700 py-0 px-1 rounded focus:outline-none focus:shadow-outline border-b-2 border-gray-500 hover:border-gray-300"
          type="button"
          onClick={onSwitchClick}
        >
          <span>{switchState === 'taskId' ? 'Aa' : '#'}</span>
          <span className="mx-1">&#8646;</span>
          <span>{switchState === 'taskId' ? '#' : 'Aa'}</span>
        </button>

        {switchState === 'taskId'
          ? (
            <input
              className="flex-grow appearance-none text-gray-700 leading-tight focus:outline-none"
              type="text"
              placeholder="Task id"
              name="taskId"
              onBlur={onTaskIdBlur}
              disabled={disabled}
              defaultValue={task ? task.id : undefined}
            />
          )
          : (
            <input
              className="flex-grow appearance-none text-gray-700 leading-tight focus:outline-none"
              type="text"
              placeholder="Name your task"
              id="taskName"
              name="taskName"
              onChange={onTaskNameChange}
              nameValue={nameValue}
              disabled={disabled}
            />
          )}
      </div>
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
  onTaskIdBlur: PropTypes.func.isRequired,
  onTaskNameChange: PropTypes.func.isRequired,
  onSwitchClick: PropTypes.func.isRequired,
  nameValue: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  task: PropTypes.shape({

  }),
  disabled: PropTypes.bool,
  error: PropTypes.string,
  switchState: PropTypes.string,
};

TimerCard.defaultProps = {
  task: null,
  disabled: false,
  error: null,
  switchState: 'taskId',
};

export default TimerCard;
