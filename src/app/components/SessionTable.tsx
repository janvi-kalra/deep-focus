import React from 'react';

interface Session {
  id: number;
  start: string;
  end: string;
  totalTime: string;
  tag: string;
  description: string;
}

interface SessionTableProps {
  sessions: Session[];
}

const SessionTable: React.FC<SessionTableProps> = ({ sessions }) => {
  return (
    <div className="overflow-x-auto bg-white shadow-sm rounded-lg border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {['Start', 'End', 'Total Time', 'Tag', 'Description'].map((header) => (
              <th key={header} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {sessions.map((session) => (
            <tr key={session.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{session.start}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{session.end}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{session.totalTime}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{session.tag}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{session.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SessionTable;
