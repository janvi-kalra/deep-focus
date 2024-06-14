"use client"
import React, { useState, useEffect } from 'react';
import Timer from './components/Timer';
import DeepWorkForm from './components/DeepWorkForm';
import SessionTable from './components/SessionTable';
import WeeklyChart from './components/WeeklyChart';

const Home: React.FC = () => {
  const initialDuration = 30; // Test with 30 seconds
  const [sessions, setSessions] = useState<any[]>([]);
  const [currentSession, setCurrentSession] = useState<any | null>(null);

  useEffect(() => {
    const fetchSessions = async () => {
      const response = await fetch('/api/sessions');
      const data = await response.json();
      setSessions(data);
    };
    fetchSessions();
  }, []);

  const handleExpire = async () => {
    if (!currentSession) return;

    const end = new Date().toISOString();
    const totalTime = calculateTotalTime(currentSession.start, end);

    const response = await fetch(`/api/sessions/${currentSession.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ end, totalTime }),
    });

    if (response.ok) {
      setSessions(sessions.map(session => 
        session.id === currentSession.id ? { ...session, end, totalTime } : session
      ));
    }

    setCurrentSession(null);
  };

  const handleFormSubmit = async (session: any) => {
    setSessions([session, ...sessions]);
    setCurrentSession(session);
  };

  const handleDelete = (id: number) => {
    setSessions(sessions.filter(session => session.id !== id));
  };

  const calculateTotalTime = (start: string, end: string) => {
    const startTime = new Date(start);
    const endTime = new Date(end);
    const diffMs = endTime.getTime() - startTime.getTime();
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.round((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    if (diffHrs === 0) {
      return `${diffMins}min`;
    }
    return `${diffHrs}h ${diffMins}min`;
  };

  const calculateWeeklyData = () => {
    const weeklyData = [
      { date: 'Mon', hours: 0 },
      { date: 'Tue', hours: 0 },
      { date: 'Wed', hours: 0 },
      { date: 'Thu', hours: 0 },
      { date: 'Fri', hours: 0 },
      { date: 'Sat', hours: 0 },
      { date: 'Sun', hours: 0 },
    ];

    sessions.forEach(session => {
      if (session.end) {
        const day = new Date(session.start).getDay();
        const totalTime = calculateTotalTime(session.start, session.end);
        const hours = parseFloat(totalTime.split('h')[0]) || 0;
        const mins = parseFloat(totalTime.split('h')[1]?.split('min')[0]) || 0;
        const totalHours = hours + mins / 60;

        switch (day) {
          case 0:
            weeklyData[6].hours += totalHours; // Sunday
            break;
          case 1:
            weeklyData[0].hours += totalHours; // Monday
            break;
          case 2:
            weeklyData[1].hours += totalHours; // Tuesday
            break;
          case 3:
            weeklyData[2].hours += totalHours; // Wednesday
            break;
          case 4:
            weeklyData[3].hours += totalHours; // Thursday
            break;
          case 5:
            weeklyData[4].hours += totalHours; // Friday
            break;
          case 6:
            weeklyData[5].hours += totalHours; // Saturday
            break;
        }
      }
    });

    return weeklyData;
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <Timer onExpire={handleExpire} initialDuration={initialDuration} />
        <DeepWorkForm onSessionStart={handleFormSubmit} />
        <SessionTable sessions={sessions} onDelete={handleDelete} />
        <WeeklyChart data={calculateWeeklyData()} />
      </div>
    </div>
  );
};

export default Home;
