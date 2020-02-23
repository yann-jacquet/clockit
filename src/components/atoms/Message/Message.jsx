import React from 'react';
import PropTypes from 'prop-types';

const Message = ({ colorScheme, children }) => (
  <div
    className={`
      w-full font-bold py-2 px-4 rounded border-b-4 mb-3 text-sm
      ${colorScheme === 'info' ? ' bg-blue-300 border-blue-700 text-blue-700' : ''} 
      ${colorScheme === 'error' ? ' bg-red-300 border-red-700 text-red-700' : ''} 
      ${colorScheme === 'success' ? ' bg-green-300 border-green-700 text-green-700' : ''} 
    `}
  >
    {children}
  </div>
);

Message.propTypes = {
  colorScheme: PropTypes.oneOf(['info', 'error', 'success']).isRequired,
  children: PropTypes.node.isRequired,
};

export default Message;
