import React, { useState } from 'react';
import CalendarDayView from './CalendarDayView';
import { TaskCommandBar } from './TaskCommandBar';

const CalendarMain: React.FC = () => {
  const [currentView, setCurrentView] = useState<'day' | 'week' | 'month'>('day');
  
  // Bar State
  const [isBarOpen, setIsBarOpen] = useState(false);
  const [clickedDate, setClickedDate] = useState<Date>(new Date());
  const [clickedHour, setClickedHour] = useState<number>(0);

  // 1. OPEN: Triggered by clicking a cell
  const handleCellClick = (date: Date, hour: number) => {
    setClickedDate(date);
    setClickedHour(hour);
    setIsBarOpen(true);
  };

  // 2. CLOSE: Triggered by onClose (saved) or clicking outside
  const handleCloseBar = () => {
    setIsBarOpen(false);
  };

  return (
    <div className="calendar-main">
      {/* View Toggle */}
      <div className="switch-toggle" style={{ marginBottom: '20px' }}>
        <button onClick={() => setCurrentView('day')} className={currentView === 'day' ? 'active' : ''}>Day</button>
        <button onClick={() => setCurrentView('week')} className={currentView === 'week' ? 'active' : ''}>Week</button>
        <button onClick={() => setCurrentView('month')} className={currentView === 'month' ? 'active' : ''}>Month</button>
      </div>

      {/* Grid (Click to open bar) */}
      <div className="view-container" style={{ paddingBottom: '100px' }}>
        {currentView === 'day' && <CalendarDayView onCellClick={handleCellClick} />}
      </div>

      {/* Slide up Bar */}
      <TaskCommandBar 
        isOpen={isBarOpen} 
        onClose={handleCloseBar} // 👈 This hides it after save
        selectedDate={clickedDate} 
        selectedHour={clickedHour} 
      />
    </div>
  );
};

export default CalendarMain;