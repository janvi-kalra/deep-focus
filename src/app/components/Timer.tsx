import React, { useState, useEffect } from 'react';
import { useTimer } from 'react-timer-hook';

interface TimerProps {
  onExpire: (timeElapsed: number) => void;
  initialDuration: number;
  initIsRunning: boolean;
}

const Timer: React.FC<TimerProps> = ({ onExpire, initialDuration, initIsRunning }) => {
  const [remainingTime, setRemainingTime] = useState(initialDuration);

  const { seconds, minutes, hours, pause, resume, restart, isRunning} = useTimer({
    expiryTimestamp: new Date(),
    autoStart: false,
    onExpire: () => onExpire(initialDuration - remainingTime),
  });

  useEffect(() => {
    if (initIsRunning) {
      const time = new Date();
      time.setSeconds(time.getSeconds() + remainingTime);
      restart(time);
    } else {
      pause();
    }
  }, [initIsRunning, remainingTime, restart, pause]);

  const handlePause = () => {
    if (isRunning) {
      pause();
      setRemainingTime(seconds + minutes * 60 + hours * 3600);  
    } else {
      resume();
    }
  };

  const handleReset = () => {
    const time = new Date();
    time.setSeconds(time.getSeconds() + initialDuration);
    restart(time, false);
    setRemainingTime(initialDuration);
  };

  const handleDone = () => {
    const updatedRemainingTime = seconds + minutes * 60 + hours * 3600
    setRemainingTime(updatedRemainingTime);
    onExpire(initialDuration - updatedRemainingTime);
    handleReset();
  };

  const formatTime = (time: number) => String(time).padStart(2, '0');

  if (!isRunning && !remainingTime) {
    return <div> </div>
  }

  return (
    <div className="flex flex-col items-center p-4 bg-white shadow-sm rounded-lg border border-gray-200 space-y-4">
      <div className="text-2xl font-mono">
        <span>{formatTime(hours)}</span>h, <span>{formatTime(minutes)}</span>m, <span>{formatTime(seconds)}</span>s
      </div>
      <div className="flex space-x-2">
        <button onClick={handlePause} className="btn">{isRunning ? 'Pause' : 'Resume'}</button>
        <button onClick={handleDone} className="btn">Done</button>
      </div>
    </div>
  );
};

export default Timer;
