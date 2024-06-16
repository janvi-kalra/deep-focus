"use client";
import React, { useState, useEffect } from 'react';
import Timer from './components/Timer';
import DeepWorkForm from './components/DeepWorkForm';
import SessionTable from './components/SessionTable';
import GitHubCalendar, { Activity } from 'react-github-calendar';

export interface Session {
  id: number;
  start: string;
  end?: string;
  totalTime?: string;
  focused?: number;
  tag: string;
  description: string;
}

const Home: React.FC = () => {
  const initialDuration = 90 * 60; // 90 minutes
  const [sessions, setSessions] = useState<Session[]>([]);
  const [currentSession, setCurrentSession] = useState<Session | null>(null);

  useEffect(() => {
    const fetchSessions = async () => {
      const response = await fetch('/api/sessions');
      const data = await response.json();
      setSessions(data);
    };
    fetchSessions();
  }, []);

  const handleExpire = async (timeElapsed: number) => {
    if (!currentSession) return;

    const end = new Date().toISOString();
    const focused = timeElapsed;

    const response = await fetch(`/api/sessions/${currentSession.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ end, focused }),
    });

    if (response.ok) {
      setSessions(sessions.map(session =>
        session.id === currentSession.id ? { ...session, end, focused } : session
      ));
    }

    const audio = new Audio('/alert-sound.wav');
    audio.play();  

    setCurrentSession(null);
  };

  const handleFormSubmit = async (session: Session) => {
    setSessions([session, ...sessions]);
    setCurrentSession(session);
  };

  const handleDelete = (id: number) => {
    setSessions(sessions.filter(session => session.id !== id));
  };

  const handleUpdateDescription = async (id: number, description: string) => {
    try {
      const response = await fetch(`/api/sessions`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({id, description}),
      });

      if (response.ok) {
        const newSession = await response.json();
        setSessions((prevSessions) =>
          prevSessions.map((session) =>
            session.id === newSession.id ? newSession : session
          )
        );
      }
    } catch (error) {
      console.error('Error updating session:', error);
    }
  };

  const calculateLevel = (count: number) => {
    if (count == 0 || count == 1) {
      return count
    }

    const finalValue = Math.min(Math.floor(count / 1.5), 4) as 0 | 2 | 1 | 3 | 4
    return finalValue
  }

  const calculateDailyData = (): Activity[] => {
    const startDate = new Date(new Date().getFullYear(), 0, 1);
    const endDate = new Date();
    const daysInYear = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    const data: Record<string, Activity> = {};
  
    for (let i = 0; i <= daysInYear; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      const dateString = date.toISOString().split('T')[0];
      data[dateString] = { date: dateString, count: 0, level: 0 };
    }
  
    sessions.forEach(session => {
      // Convert session start time from UTC to PST
      const sessionDateUTC = new Date(session.start);
      const sessionDatePST = new Date(sessionDateUTC.getTime() - (8 * 60 * 60 * 1000)); // Subtract 8 hours to convert UTC to PST
      const sessionDateString = sessionDatePST.toISOString().split('T')[0];
  
      if (data[sessionDateString]) {
        data[sessionDateString].count += 1;
        data[sessionDateString].level = calculateLevel(data[sessionDateString].count);
      }
    });
  
    return Object.values(data);
  };
  

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {currentSession 
          ? <Timer onExpire={handleExpire} initialDuration={initialDuration} /> 
          : <DeepWorkForm onSessionStart={handleFormSubmit} />
        }
        <SessionTable sessions={sessions} onDelete={handleDelete} onUpdateDescription={handleUpdateDescription} />
        <div className="p-4 bg-white shadow-sm rounded-lg border border-gray-200">
          <GitHubCalendar 
            username={'janvi'} 
            transformData={() => calculateDailyData()}
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
