import React from 'react';
import PropTypes from 'prop-types';

const DayCard = ({ title, dayTotalTracked, children }) => (
  <li className="text-sm rounded overflow-hidden border-b-4 border-blue-500 first:mt-2 mt-4 mb-4">
    <div className="w-full flex flex-row text-white bg-blue-500 py-1 px-3">
      <span className="flex-grow">
        {title}
      </span>
      <span className="font-bold">
        {dayTotalTracked}
      </span>
    </div>
    {children}
  </li>
);

DayCard.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  dayTotalTracked: PropTypes.string,
};

DayCard.defaultProps = {
  dayTotalTracked: '00:00:00',
};

export default DayCard;
