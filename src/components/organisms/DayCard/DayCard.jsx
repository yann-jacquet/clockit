import React from 'react';
import PropTypes from 'prop-types';

const DayCard = ({ title, children }) => (
  <li className="text-sm rounded overflow-hidden border-b-4 border-blue-500 first:mt-2 mt-4 mb-4">
    <div className="w-full text-white bg-blue-500 py-1 px-3">
      {title}
    </div>
    {children}
  </li>
);

DayCard.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default DayCard;
