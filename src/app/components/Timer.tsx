import React, { useState } from 'react';
import { useTimer } from 'react-timer-hook';

const Timer: React.FC = () => {
  const [expiryTimestamp, setExpiryTimestamp] = useState(new Date());
  const { seconds, minutes, hours, isRunning, start, pause, resume, restart } = useTimer({
    expiryTimestamp,
    onExpire: () => console.warn('onExpire called'),
  });

  const handleStart = () => {
    const time = new Date();
    time.setMinutes(time.getMinutes() + 90);
    restart(time);
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-white shadow-sm rounded-lg border border-gray-200">
      <div className="text-2xl font-mono">
        <span>{hours}</span>:<span>{minutes}</span>:<span>{seconds}</span>
      </div>
      <div className="mt-4 space-x-2">
        <button onClick={start} className="btn">Start</button>
        <button onClick={pause} className="btn">Pause</button>
        <button onClick={handleStart} className="btn">Reset</button>
      </div>
    </div>
  );
};

export default Timer;
