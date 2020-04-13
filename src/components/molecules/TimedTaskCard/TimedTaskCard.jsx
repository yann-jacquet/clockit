import React from 'react';
import PropTypes from 'prop-types';

// Style
import './TimedTaskCard.css';

const TimedTaskCard = ({
  isNonIdTask, children, onLinkIDClick, onDeleteClick,
}) => (
  <li className={`
    timed-task-card relative text-gray-700 bg-white flex flex-row items-center py-2 px-3 border-b-2 first:border-t-2 last:border-b-0 border-gray-200 hover:shadow
    ${isNonIdTask ? ' bg-blue-100' : ''}`}
  >
    {children}
    <div className="timed-task-card-link-btn absolute right-0 text-right flex flex-col items-end">
      {onLinkIDClick
        ? (
          <button
            className={`
              block mb-1 bg-blue-300 hover:bg-blue-500 text-white font-bold py-1 px-2 rounded rounded-r-none shadow-md focus:outline-none focus:shadow-outline border-b-4 border-blue-500 hover:border-blue-300
            `}
            type="button"
            onClick={onLinkIDClick}
          >
            Link to an ID
          </button>
        )
        : null}
      <button
        className={`
          block bg-red-300 hover:bg-red-500 text-white font-bold py-1 px-2 rounded rounded-r-none shadow-md focus:outline-none focus:shadow-outline border-b-4 border-red-500 hover:border-red-300
        `}
        type="button"
        onClick={onDeleteClick}
      >
        Delete
      </button>
    </div>
  </li>
);

TimedTaskCard.propTypes = {
  children: PropTypes.node.isRequired,
  isNonIdTask: PropTypes.bool,
  onLinkIDClick: PropTypes.func,
  onDeleteClick: PropTypes.func,
};

TimedTaskCard.defaultProps = {
  isNonIdTask: false,
  onLinkIDClick: undefined,
  onDeleteClick: undefined,
};

export default TimedTaskCard;
