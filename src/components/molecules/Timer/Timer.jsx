import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

// Utils
import formatTimestamp from "../../../utils/formatTimestamp";

const Timer = ({
  handleStart,
  handleStop,
  startTimestamp,
  disabled,
  timerState,
}) => {
  const [timerString, setTimerString] = useState("");

  useEffect(() => {
    let interval = null;
    if (timerState === "running") {
      interval = setInterval(() => {
        const timeDifference = Date.now() - startTimestamp;
        setTimerString(formatTimestamp(timeDifference));
      }, 1000);
    } else setTimerString("");
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [startTimestamp]);

  return (
    <div>
      {timerState === "stopped" ? (
        <button
          className={`
              w-24 text-sm bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline border-b-4 border-green-700 hover:border-green-500
              ${disabled ? " opacity-50 cursor-not-allowed" : ""}
            `}
          type="button"
          onClick={handleStart}
          disabled={disabled}
        >
          Start
        </button>
      ) : (
        <button
          className={`
              w-24 text-sm bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline border-b-4 border-red-700 hover:border-red-500
              ${disabled ? " opacity-50 cursor-not-allowed" : ""}
            `}
          type="button"
          onClick={handleStop}
          disabled={disabled}
        >
          {timerString || "00:00:00"}
        </button>
      )}
    </div>
  );
};

Timer.propTypes = {
  startTimestamp: PropTypes.number.isRequired,
  handleStart: PropTypes.func.isRequired,
  handleStop: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  timerState: PropTypes.oneOf(["running", "stopped"]),
};

Timer.defaultProps = {
  disabled: false,
  timerState: false,
};

export default Timer;
