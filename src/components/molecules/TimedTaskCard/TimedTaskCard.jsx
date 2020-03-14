import React from 'react';
import PropTypes from 'prop-types';

const TimedTaskCard = ({ isNonIdTask, children }) => (
  <li className={`
    text-gray-700 bg-white flex flex-row items-center py-2 px-3 border-b-2 first:border-t-2 last:border-b-0 border-gray-200 hover:shadow
    ${isNonIdTask ? ' bg-blue-100' : ''}`}
  >
    {children}
  </li>
);

TimedTaskCard.propTypes = {
  children: PropTypes.node.isRequired,
  isNonIdTask: PropTypes.bool,
};

TimedTaskCard.defaultProps = {
  isNonIdTask: false,
};

export default TimedTaskCard;
