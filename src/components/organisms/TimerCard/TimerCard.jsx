import React from 'react';
import PropTypes from 'prop-types';

const TimerCard = ({ handleTaskIdBlur, task, children }) => (
  <div>
    <input type="text" placeholder="Task id" name="taskId" onBlur={handleTaskIdBlur} />
    {task
      ? (
        <div>
          <span>{`Subject : ${task.subject}`}</span>
          <span>{`Project : ${task.project.name}`}</span>
          <span>{`Assignee : ${task.assigned_to.name}`}</span>
        </div>
      )
      : null}
    <div>
      {children}
    </div>
  </div>
);

TimerCard.propTypes = {
  handleTaskIdBlur: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};

export default TimerCard;
