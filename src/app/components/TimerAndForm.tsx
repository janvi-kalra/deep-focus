import React, { useState, useEffect } from 'react';
import { useTimer } from 'react-timer-hook';

interface AddSessionFormProps {
  onAddSession: (session: any) => void;
}

const TimerAndForm: React.FC<AddSessionFormProps> = ({ onAddSession }) => {
  const initialDuration = 2; // Duration in seconds (use 90 * 60 for 90 minutes)
  const [expiryTimestamp, setExpiryTimestamp] = useState(new Date());
  const [isRunning, setIsRunning] = useState(false);
  const [remainingTime, setRemainingTime] = useState(initialDuration);

  const { seconds, minutes, hours, start, pause, resume, restart } = useTimer({
    expiryTimestamp,
    autoStart: false,
    onExpire: () => handleExpire(),
  });

  useEffect(() => {
    // Request notification permission on mount
    if (Notification.permission !== 'granted') {
      Notification.requestPermission();
    }
  }, []);

  const handleExpire = () => {
    // Play sound
    const audio = new Audio('/alert-sound.wav');
    audio.play();

    // Show notification
    if (Notification.permission === 'granted') {
      new Notification('Timer Alert', { body: 'Your timer has reached 0!' });
    } else {
      alert('Your timer has reached 0!');
    }
  };

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

  const [tag, setTag] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const elapsedSeconds = initialDuration - remainingTime; // calculate elapsed time in seconds
    const elapsedTime = new Date(elapsedSeconds * 1000).toISOString().substr(11, 8); // format elapsed time as HH:MM:SS
    const start = new Date().toISOString();
    const end = new Date(new Date().getTime() + elapsedSeconds * 1000).toISOString();
    const totalTime = elapsedTime;

    onAddSession({ start, end, totalTime, tag, description });

    setTag('');
    setDescription('');
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
      <form onSubmit={handleSubmit} className="w-full flex flex-col space-y-2">
        <div className="flex space-x-2">
          <select
            value={tag}
            onChange={(e) => setTag(e.target.value)}
            className="p-2 border border-gray-300 rounded-md w-1/3"
          >
            <option value="" disabled>Select a tag</option>
            <option value="Work">Work</option>
            <option value="Study">Study</option>
            <option value="Exercise">Exercise</option>
            <option value="Other">Other</option>
          </select>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
            className="p-2 border border-gray-300 rounded-md w-2/3 font-mono"
          />
        </div>
        <button type="submit" className="btn">Commit</button>
      </form>
    </div>
  );
};

export default TimerAndForm;
