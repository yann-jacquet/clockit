import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'

// Style
import './BottomModal.css'

const BottomModal = ({ isVisible, children }) => {
  return isVisible && ReactDOM.createPortal(
    (
      <>
        <div className="modal-bg absolute bg-black z-40 left-0 right-0 bottom-0 top-0" />
        <div className="bottom-modal absolute z-50 left-0 right-0 bottom-0 bg-white rounded rounded-b-none p-4">
          {children}
        </div>
      </>
    ),
    // A DOM element
    document.body,
  );
}

BottomModal.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  children: PropTypes.number.isRequired,
}

export default BottomModal
