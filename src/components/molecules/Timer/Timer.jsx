import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

// Utils
import formatTimestamp from '../../../utils/formatTimestamp';

const Timer = ({ handleStart, handleStop, disabled }) => {
  const [startTimestamp, setStartTimestamp] = useState(0);
  const [timerString, setTimerString] = useState('');

  useEffect(() => {
    let interval = null;
    if (startTimestamp > 0) {
      interval = setInterval(() => {
        const timeDifference = Date.now() - startTimestamp;
        setTimerString(formatTimestamp(timeDifference));
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [startTimestamp]);

  const handleStartClick = () => {
    setStartTimestamp(Date.now());
    if (handleStart) handleStart();
  };

  const handleStopClick = () => {
    setStartTimestamp(0);
    setTimerString('');

    if (handleStop) {
      handleStop({
        start: startTimestamp,
        end: Date.now(),
      });
    }
  };

  return (
    <div>
      {startTimestamp === 0
        ? (
          <button
            type="button"
            onClick={handleStartClick}
            disabled={disabled}
          >
          Start
          </button>
        )
        : (
          <button
            type="button"
            onClick={handleStopClick}
            disabled={disabled}
          >
            Stop
          </button>
        )}
      {timerString
        ? <span>{timerString}</span>
        : null}
    </div>
  );
};

Timer.propTypes = {
  handleStart: PropTypes.func,
  handleStop: PropTypes.func,
  disabled: PropTypes.bool,
};

Timer.defaultProps = {
  handleStart: undefined,
  handleStop: undefined,
  disabled: false,
};

export default Timer;
