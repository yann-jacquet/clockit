import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const Timer = ({ handleStart, handleStop, disabled }) => {
  const [startTimestamp, setStartTimestamp] = useState(0);
  const [timerString, setTimerString] = useState('');

  const timeDifference = () => {
    const duration = Date.now() - startTimestamp;
    const seconds = Math.floor((duration / 1000) % 60);
    const minutes = Math.floor((duration / (1000 * 60)) % 60);
    const hours = Math.floor((duration / (1000 * 60 * 60)) % 24);
    const formated = {
      hours: (hours < 10) ? `0${hours}` : hours,
      minutes: (minutes < 10) ? `0${minutes}` : minutes,
      seconds: (seconds < 10) ? `0${seconds}` : seconds,
    };

    return `${formated.hours}:${formated.minutes}:${formated.seconds}`;
  };

  useEffect(() => {
    let interval = null;
    if (startTimestamp > 0) {
      interval = setInterval(() => {
        setTimerString(timeDifference());
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

  const handleStopClick = () => handleStop({
    start: startTimestamp,
    end: Date.now(),
  });

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
      <span>{timerString || null}</span>
    </div>
  );
};

Timer.propTypes = {
  disabled: PropTypes.bool,
};

Timer.defaultProps = {
  disabled: false,
};

export default Timer;
