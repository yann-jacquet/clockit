import React from 'react';
import PropTypes from 'prop-types';

const Notification = ({ children }) => (
  <div className="absolute bottom-0 left-0 rounded bg-white p-4 flex flex-col text-sm text-gray-700">
    {children}
  </div>
);

Notification.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Notification;
