import React, { useState } from 'react';

interface DeepWorkFormProps {
  onSessionStart: (session: any) => void;
}

const DeepWorkForm: React.FC<DeepWorkFormProps> = ({ onSessionStart }) => {
  const [tag, setTag] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const start = new Date().toISOString();
    const newSession = { start, tag, description };

    try {
      const response = await fetch('/api/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSession),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || 'Failed to create session');
      }

      const session = await response.json();
      onSessionStart(session);
      setTag('');
      setDescription('');
      setError(null);
    } catch (error: any) {
      console.error('Error creating session:', error);
      setError(`Failed to create session. ${error.message}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-4 p-4 bg-white shadow-sm rounded-lg border border-gray-200">
      <div className="flex space-x-4">
        <input
          type="text"
          value={tag}
          onChange={(e) => setTag(e.target.value)}
          placeholder="Tag"
          className="w-1/3 p-2 border-b border-gray-300 outline-none"
        />
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          className="w-2/3 p-2 border-b border-gray-300 outline-none font-mono"
        />
      </div>
      <button type="submit" className="btn">Start Session</button>
      {error && <p className="text-red-500">{error}</p>}
    </form>
  );
};

export default DeepWorkForm;
