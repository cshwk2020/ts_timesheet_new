import React, { useState } from 'react';
import './CalendarMain.css';
import CalendarDayView from './CalendarDayView';
import CalendarMonthView from './CalendarMonthView';
import CalendarWeekView from './CalendarWeekView';
import CalendarYearView from './CalendarYearView';

type CalendarView = 'day' | 'week' | 'month' | 'year';

const VIEWS: CalendarView[] = ['day', 'week', 'month', 'year'];

const CalendarMain: React.FC = () => {
  const [view, setView] = useState<CalendarView>('day');

  const renderView = () => {
    switch (view) {
      case 'day':   return <CalendarDayView />;
      case 'week':  return <CalendarWeekView />;
      case 'month': return <CalendarMonthView />;
      case 'year':  return <CalendarYearView />;
    }
  };
  
  return (
    <div>
      <div className="switch-toggle">
        {VIEWS.map((v) => (
          <button
            key={v}
            type="button"
            className={`switch-toggle-btn ${view === v ? 'active' : ''}`}
            onClick={() => setView(v)}
          >
            {v.charAt(0).toUpperCase() + v.slice(1)}
          </button>
        ))}
      </div>

 
      <div className="calendar-view-container">
        {renderView()}
      </div>

       
    </div>
  );
};

export default CalendarMain;