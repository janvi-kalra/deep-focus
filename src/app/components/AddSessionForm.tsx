import React, { useState } from 'react';

interface AddSessionFormProps {
  onAddSession: (session: any) => void;
}

const AddSessionForm: React.FC<AddSessionFormProps> = ({ onAddSession }) => {
  const [tag, setTag] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const start = new Date().toISOString();
    const end = new Date(new Date().getTime() + 90 * 60 * 1000).toISOString();
    const totalTime = '90 minutes';

    onAddSession({ start, end, totalTime, tag, description });

    setTag('');
    setDescription('');
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col p-4 bg-white shadow-sm rounded-lg border border-gray-200 space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Tag</label>
        <input
          type="text"
          value={tag}
          onChange={(e) => setTag(e.target.value)}
          className="mt-1 p-2 border border-gray-300 rounded-md w-full"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mt-1 p-2 border border-gray-300 rounded-md w-full"
        />
      </div>
      <button type="submit" className="btn">Add Session</button>
    </form>
  );
};

export default AddSessionForm;
