import React, { useState } from 'react';
import { useTimer } from 'react-timer-hook';

interface TimerProps {
  onExpire: () => void;
  initialDuration: number;
}

const Timer: React.FC<TimerProps> = ({ onExpire, initialDuration }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [remainingTime, setRemainingTime] = useState(initialDuration);

  const { seconds, minutes, hours, start, pause, resume, restart } = useTimer({
    expiryTimestamp: new Date(),
    autoStart: false,
    onExpire,
  });

  const handleStartStop = () => {
    if (isRunning) {
      pause();
      setRemainingTime(seconds + minutes * 60 + hours * 3600); // save remaining time
    } else {
      const time = new Date();
      time.setSeconds(time.getSeconds() + remainingTime);
      restart(time);
    }
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    const time = new Date();
    time.setSeconds(time.getSeconds() + initialDuration);
    restart(time, false);
    setIsRunning(false);
    setRemainingTime(initialDuration);
  };

  const formatTime = (time: number) => String(time).padStart(2, '0');

  return (
    <div className="flex flex-col items-center p-4 bg-white shadow-sm rounded-lg border border-gray-200 space-y-4">
      <div className="text-2xl font-mono">
        <span>{formatTime(hours)}</span>h, <span>{formatTime(minutes)}</span>m, <span>{formatTime(seconds)}</span>s
      </div>
      <div className="flex space-x-2">
        <button onClick={handleStartStop} className="btn">{isRunning ? 'Stop' : 'Start'}</button>
        <button onClick={handleReset} className="btn">Reset</button>
      </div>
    </div>
  );
};

export default Timer;
