import React, { useEffect, useState } from 'react';
import CalendarDayView from './CalendarDayView';
import { TaskCommandBar } from './TaskCommandBar';
import { clearError } from '../actions/errorActions';
import type { Task } from '../types';
import type { RootState } from '../reducers';
import { useDispatch, useSelector } from 'react-redux';
import { ErrorModal } from './ErrorModal';
import { DialogModal } from './DialogModal';

const CalendarMain: React.FC = () => {

  const dispatch = useDispatch();
  
  const [currentView, setCurrentView] = useState<'day' | 'week' | 'month'>('day');
  
  // Bar State
  const [isBarOpen, setIsBarOpen] = useState(false);
  const [clickedDate, setClickedDate] = useState<Date>(new Date());
  const [clickedHour, setClickedHour] = useState<number>(0);

  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const errorMessage = useSelector((state: RootState) => {
    console.log("Current Redux error state:", state.error);
    return state.error?.message;
  });

  const dialogMessage = useSelector((state: RootState) => {
    console.log("Current Redux dialog state:", state.dialog);
    return state.dialog?.message;
  });

  // 1. OPEN: Triggered by clicking a cell
  const handleCellClick = (date: Date, hour: number) => {
    setClickedDate(date);
    setClickedHour(hour);
    setEditingTask(null);
    setIsBarOpen(true);
  };

  const handleTaskClick = (task: Task) => {
    console.log("Task clicked!", task);
    setClickedDate(new Date(task.from_datetime)); 
    setClickedHour(new Date(task.from_datetime).getHours());
    setEditingTask(task); // Set editing state (we are EDITING)
    setIsBarOpen(true);
  };

  const handleCloseBar = () => {
    setIsBarOpen(false);
  };

  /*
  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => {
        dispatch(clearError());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage, dispatch]);
  */

  return (
    <div className="calendar-main">
      {/* View Toggle */}
      <div className="switch-toggle" style={{ marginBottom: '20px' }}>
        <button onClick={() => setCurrentView('day')} className={currentView === 'day' ? 'active' : ''}>Day</button>
        <button onClick={() => setCurrentView('week')} className={currentView === 'week' ? 'active' : ''}>Week</button>
        <button onClick={() => setCurrentView('month')} className={currentView === 'month' ? 'active' : ''}>Month</button>
      </div>

 

      {errorMessage && (
        <ErrorModal 
        message={errorMessage} 
        onClose={() => dispatch(clearError())} 
      />
      )}


      {dialogMessage && (
        <DialogModal />
      )}


      {/* Grid (Click to open bar) */}
      <div className="view-container" style={{ paddingBottom: '100px' }}>
        {currentView === 'day' && <CalendarDayView 
          onCellClick={handleCellClick} 
          onTaskClick={handleTaskClick} 
        />}
      </div>

      {/* Slide up Bar */}
      <TaskCommandBar 
        isOpen={isBarOpen} 
        onClose={handleCloseBar} // 👈 This hides it after save
        selectedDate={clickedDate} 
        selectedHour={clickedHour} 
        editingTask={editingTask}
      />
    </div>
  );
};

export default CalendarMain;

 