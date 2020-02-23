import React from 'react';
import PropTypes from 'prop-types';

const TimedTaskCard = ({ children }) => (
  <li className="text-gray-700 bg-white flex flex-row items-center py-2 px-3 border-b-2 first:border-t-2 last:border-b-0 border-gray-200 hover:shadow">
    {children}
  </li>
);

TimedTaskCard.propTypes = {
  children: PropTypes.node.isRequired,
};

export default TimedTaskCard;
