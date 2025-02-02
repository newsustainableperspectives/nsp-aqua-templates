import React from 'react';
import './Timeline.css'; // Include this for custom styling

const Timeline = ({ startDate, endDate }) => {
  // Generate dates based on range
  const generateDates = (start, end) => {
    const dates = [];
    let currentDate = new Date(start);

    while (currentDate <= new Date(end)) {
      dates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 7); // Increment by 1 week
    }

    return dates;
  };

  const formatMonth = (date) => {
    return date.toLocaleString('default', { month: 'long', year: 'numeric' });
  };

  const formatDay = (date) => {
    return date.getDate();
  };

  const dates = generateDates(startDate, endDate);

  return (
    <div className="gantt-chart">
      <div className="gantt-header">
        {dates.map((date, index) => (
          <div key={index} className="gantt-month">
            {index === 0 || date.getDate() < 7 ? formatMonth(date) : ''}
          </div>
        ))}
      </div>
      <div className="gantt-days">
        {dates.map((date, index) => (
          <div key={index} className="gantt-day">
            {formatDay(date)}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Timeline;