"use client"; // This is a client component 

import Image from "next/image";
import { useState } from "react";
import Timer from "./components/Timer";
import AddSessionForm from "./components/AddSessionForm";
import SessionTable from "./components/SessionTable";

export default function Home() {
  const [sessions, setSessions] = useState<any[]>([]);

  const handleAddSession = (session: any) => {
    setSessions([...sessions, { ...session, id: sessions.length + 1 }]);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <Timer />
        <AddSessionForm onAddSession={handleAddSession} />
        <SessionTable sessions={sessions} />
      </div>
    </div>
  );
};


