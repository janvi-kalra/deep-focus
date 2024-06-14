import React, { useState, useEffect } from 'react';

interface Session {
  id: number;
  start: string;
  end?: string;
  totalTime?: string;
  tag: string;
  description: string;
}

interface SessionTableProps {
  sessions: Session[];
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleString('en-US', { weekday: 'short', hour: 'numeric', minute: 'numeric' });
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

const SessionTable: React.FC<SessionTableProps> = ({ sessions }) => {
  const [filter, setFilter] = useState('today');

  const filteredSessions = sessions.filter(session => {
    const sessionDate = new Date(session.start).toLocaleDateString();
    const today = new Date().toLocaleDateString();
    const yesterday = new Date(Date.now() - 86400000).toLocaleDateString();

    if (filter === 'today') {
      return sessionDate === today;
    } else if (filter === 'yesterday') {
      return sessionDate === yesterday;
    } else {
      return true;
    }
  });

  return (
    <div>
      <div className="flex space-x-4 mb-4">
        <button className="btn" onClick={() => setFilter('today')}>Today</button>
        <button className="btn" onClick={() => setFilter('yesterday')}>Yesterday</button>
        <button className="btn" onClick={() => setFilter('all')}>All</button>
      </div>
      <div className="overflow-x-auto bg-white shadow-sm rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">End</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Time</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tag</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredSessions.map((session) => (
              <tr key={session.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(session.start)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{session.end ? formatDate(session.end) : 'In progress'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{session.end ? calculateTotalTime(session.start, session.end) : 'In progress'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{session.tag}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{session.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SessionTable;
