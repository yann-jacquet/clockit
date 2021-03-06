import React from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";

// Style
import "./BottomModal.css";

const BottomModal = ({ isVisible, children }) =>
  isVisible &&
  ReactDOM.createPortal(
    <>
      <div className="modal-bg fixed bg-black z-40 w-screen h-screen top-0" />
      <div className="bottom-modal fixed z-50 left-0 right-0 bottom-0 bg-white rounded rounded-b-none p-4">
        {children}
      </div>
    </>,
    document.getElementById("root")
  );

BottomModal.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  children: PropTypes.number.isRequired,
};

export default BottomModal;
