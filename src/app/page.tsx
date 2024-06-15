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
  tag: string;
  description: string;
}

const Home: React.FC = () => {
  const initialDuration = 90 * 60; // Test with 30 seconds
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

  const handleFormSubmit = async (session: Session) => {
    setSessions([session, ...sessions]);
    setCurrentSession(session);
  };

  const handleDelete = (id: number) => {
    setSessions(sessions.filter(session => session.id !== id));
  };

  const handleUpdateDescription = async (updatedSession: Session) => {
    try {
      const response = await fetch(`/api/sessions`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedSession),
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
      const sessionDate = new Date(session.start).toISOString().split('T')[0];
      if (data[sessionDate]) {
        data[sessionDate].count += 1;
        data[sessionDate].level = Math.min(data[sessionDate].count, 4);
      }
    });

    return Object.values(data);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <Timer onExpire={handleExpire} initialDuration={initialDuration} />
        <DeepWorkForm onSessionStart={handleFormSubmit} />
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
