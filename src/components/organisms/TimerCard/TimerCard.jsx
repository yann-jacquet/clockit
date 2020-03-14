import React, { useState } from 'react';
import PropTypes from 'prop-types';

const TimerCard = ({
  onInputBlur, onSwitchClick, trackingMode, task, disabled, disableSwitch, error, children,
}) => (
    <div className="w-full shadow bg-white py-2 px-3 flex flex-row items-center sticky top-0">
      <div className="pr-2 flex-grow flex flex-col text-gray-700">
        <div htmlFor="taskId" className="flex flex-row text-gray-700 text-sm font-bold">
          <button
            className="mr-1 bg-gray-300 hover:bg-gray-500 text-sm text-gray-700 py-0 px-1 rounded focus:outline-none focus:shadow-outline border-b-2 border-gray-500 hover:border-gray-300"
            type="button"
            onClick={onSwitchClick}
            disabled={disableSwitch}
          >
            <span>{trackingMode === 'withId' ? 'Aa' : '#'}</span>
            <span className="mx-1">&#8646;</span>
            <span>{trackingMode === 'withId' ? '#' : 'Aa'}</span>
          </button>

          {trackingMode === 'withId'
            ? (
              <input
                className="flex-grow appearance-none text-gray-700 leading-tight focus:outline-none"
                type="text"
                placeholder="Task id"
                name="taskId"
                onBlur={onInputBlur}
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
                onBlur={onInputBlur}
                disabled={disabled}
                defaultValue={task ? task.subject : undefined}
              />
            )}
        </div>
        {error
          ? <span className="text-red-500">{error}</span>
          : null}
        {task && trackingMode === 'withId'
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
  onInputBlur: PropTypes.func.isRequired,
  onSwitchClick: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
  task: PropTypes.shape({
  }),
  disabled: PropTypes.bool,
  disableSwitch: PropTypes.bool,
  error: PropTypes.string,
  trackingMode: PropTypes.oneOf(['withId', 'withName']),
};

TimerCard.defaultProps = {
  task: null,
  disabled: false,
  disableSwitch: false,
  error: null,
  trackingMode: 'withId',
};

export default TimerCard;
