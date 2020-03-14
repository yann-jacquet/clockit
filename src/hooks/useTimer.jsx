import { useState } from 'react';

const useTimer = (options = { initTimerState: 'stopped', initTimestamp: 0 }) => {
  const [timestamps, setTimestamps] = useState({ start: options.initTimestamp });
  const [timerState, setTimerState] = useState(options.initTimerState); // 'running' || 'stopped'

  const startTimer = (startTimerAt) => {
    setTimestamps({ start: startTimerAt || Date.now(), end: null });
    setTimerState('running');
  };

  const stopTimer = () => {
    setTimerState('stopped');
    setTimestamps({ start: 0 });
  };

  const getTimerTimestamps = () => timestamps;

  return {
    timerState,
    startTimer,
    stopTimer,
    getTimerTimestamps,
  };
};

export default useTimer;
