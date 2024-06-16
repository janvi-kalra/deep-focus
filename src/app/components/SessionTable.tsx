import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { Session } from '../page';

interface SessionTableProps {
  sessions: Session[];
  onDelete: (id: number) => void;
  onUpdateDescription: (id: number, description: string) => void;
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

const calculateFocusedTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const hrs = Math.floor(minutes / (60));
  if (hrs === 0) {
    return `${minutes}min`;
  }
  const diffMins = minutes - (60 * hrs)
  return `${hrs}h ${diffMins}min`;
};


const SessionTable: React.FC<SessionTableProps> = ({ sessions, onDelete, onUpdateDescription }) => {
  const [filter, setFilter] = useState('today');
  const [isEditing, setIsEditing] = useState(false);
  const [editDescription, setEditDescription] = useState(sessions[0]?.description || '');

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

  const handleDelete = async (id: number) => {
    const response = await fetch(`/api/sessions/${id}`, {
      method: 'DELETE',
    });
  
    if (response.ok) {
      onDelete(id);
    } else {
      console.error('Failed to delete session');
    }
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditDescription(e.target.value);
  };

  const handleDescriptionBlur = async (session: Session) => {
    setIsEditing(false);
    if (session.description !== editDescription) {
      const response = await fetch(`/api/sessions/${session.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ description: editDescription }),
      });
  
      if (response.ok) {
        onUpdateDescription(session.id, editDescription);
      } else {
        console.error('Failed to update session description', response.statusText);
      }
    }
  };

  const renderInProgress = (session: Session) => {
    return (
      <div className='flex'>
        <div>In progress</div>
        <button
          onClick={() => handleDelete(session.id)}
          className="text-gray-400 relative"
        >
          <FontAwesomeIcon
            icon={faTrashAlt}
            className="inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 mx-2"
          />
        </button>
      </div>
    );
  };

  return (
    <div>
      <div className="flex space-x-4 mb-4">
        <button className="light-btn" onClick={() => setFilter('today')}>Today</button>
        <button className="light-btn" onClick={() => setFilter('yesterday')}>Yesterday</button>
        <button className="light-btn" onClick={() => setFilter('all')}>All</button>
      </div>
      <div className="overflow-x-auto bg-white shadow-sm rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">End</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Time</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Focused Time</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tag</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredSessions.map((session, index) => (
              <tr key={session.id} className="group">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(session.start)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{session.end ? formatDate(session.end) : 'In progress'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{session.end ? calculateTotalTime(session.start, session.end) : renderInProgress(session)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{session.focused ? calculateFocusedTime(session.focused) : renderInProgress(session)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{session.tag}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {index === 0 && isEditing ? (
                    <input
                      type="text"
                      value={editDescription}
                      onChange={handleDescriptionChange}
                      onBlur={() => handleDescriptionBlur(session)}
                      className="w-full border border-gray-300 p-2"
                      autoFocus
                    />
                  ) : (
                    <span
                      onClick={() => index === 0 && setIsEditing(true)}
                      className="cursor-pointer"
                    >
                      {session.description}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SessionTable;
