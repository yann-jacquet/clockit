import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

// Utils
import formatTimestamp from '../../../utils/formatTimestamp';

const Timer = ({
  handleStart, handleStop, startTimestamp, disabled,
}) => {
  const [timerString, setTimerString] = useState('');

  useEffect(() => {
    let interval = null;
    if (startTimestamp > 0) {
      interval = setInterval(() => {
        const timeDifference = Date.now() - startTimestamp;
        setTimerString(formatTimestamp(timeDifference));
      }, 1000);
    } else setTimerString('');
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [startTimestamp]);

  return (
    <div>
      {startTimestamp === 0
        ? (
          <button
            type="button"
            onClick={handleStart}
            disabled={disabled}
          >
          Start
          </button>
        )
        : (
          <button
            type="button"
            onClick={handleStop}
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
  startTimestamp: PropTypes.number.isRequired,
  handleStart: PropTypes.func.isRequired,
  handleStop: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};

Timer.defaultProps = {
  disabled: false,
};

export default Timer;
