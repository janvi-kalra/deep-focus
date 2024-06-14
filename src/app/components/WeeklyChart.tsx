import React from 'react';
import GitHubCalendar from 'react-github-calendar';

interface WeeklyChartProps {
  data: { date: string; hours: number }[];
}

const WeeklyChart: React.FC<WeeklyChartProps> = ({ data }) => {
  const calendarData = data.reduce((acc, { date, hours }) => {
    acc[date] = hours;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="p-4 bg-white shadow-sm rounded-lg border border-gray-200">
      <GitHubCalendar values={calendarData} />
    </div>
  );
};

export default WeeklyChart;
