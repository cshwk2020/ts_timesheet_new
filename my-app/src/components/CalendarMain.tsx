import React, { useEffect, useState } from 'react';
import { TaskCommandBar } from './TaskCommandBar';
import { clearError, setError } from '../actions/errorActions';
import { ErrorMessages } from '../constants/errorMessages';
import { getErrorMessage } from '../utils/errorHandler';
import type { Task } from '../types';
import type { RootState } from '../reducers';
import { useDispatch, useSelector } from 'react-redux';
import { ErrorModal } from './ErrorModal';
import { DialogModal } from './DialogModal';
import CalendarDayView from './CalendarDayView';
import CalendarWeekView from './CalendarWeekView';
import CalendarMonthView from './CalendarMonthView';
import CalendarYearView from './CalendarYearView';
import { TaskTypeManager } from './TaskTypeManager';
import { AppHeader } from './AppHeader';
import { setCurrentDate } from '../actions/calendarActions';
import { CalendarNavigator } from './CalendarNavigator';

 


import './CalendarModalHeader.css';
import { loadTasksAsync } from '../actions/taskThunks';
import { BlockingOverlay } from './BlockingOverlay';


const CalendarMain: React.FC = () => {

  const dispatch = useDispatch();
  
  const [currentView, setCurrentView] = useState<'day' | 'week' | 'month'>('day');
  
  // Grab the currentDate from Redux
  const currentDateStr = useSelector((state: RootState) => state.calendar.currentDate);
  const viewMode = useSelector((state: RootState) => state.calendar.viewMode);

  const currentDate = new Date(currentDateStr);

  
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


  // update tasks from DB
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useSelector((state: RootState) => state.auth);

 

   useEffect(() => {

    console.log(`DEBUG CALENDAR MAIN,,,,,,user==`, user);
    
      if (!user) return;


      dispatch(loadTasksAsync() as any)
      .catch((error: any) => {
        console.error("Initial load failed", error);
        /*
        dispatch(
              setError('Failed to load tasks, Network disconnected or server error.')
        );
        */

        dispatch(setError(getErrorMessage(error, ErrorMessages.TASK_LOAD)));

      })
      .finally(() => setIsLoading(false));
      
  }, [dispatch, user]);


  if (isLoading) return <BlockingOverlay isLoading={isLoading} text="Loading Calendar..." />;

 
        




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

  const handleNavigate = (direction: 'prev' | 'next') => {
    const d = new Date(currentDate);
    const multiplier = direction === 'next' ? 1 : -1;

    if (currentView === 'day') {
      d.setDate(d.getDate() + multiplier);
    } 
    else if (currentView === 'week') {
      d.setDate(d.getDate() + (7 * multiplier));
    } 
    else if (currentView === 'month') {
      // 👇 The "No-Drift" Month Logic
      // 1. Save the original day (e.g., 31)
      const originalDay = d.getDate();
      
      // 2. Move to the 1st of the month to prevent JS rollover
      d.setDate(1);
      d.setMonth(d.getMonth() + multiplier);
      
      // 3. Try to restore the original day, but clamp it if the new month is shorter
      const lastDayOfNewMonth = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
      d.setDate(Math.min(originalDay, lastDayOfNewMonth));
    }

    dispatch(setCurrentDate(d));
  };

  // 👇 Direct date jump (from a date picker or text input)
  const handleDateJump = (date: Date) => {
    dispatch(setCurrentDate(date));
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
      
   
      {errorMessage && (
        <ErrorModal />
      )}

      <AppHeader />

      {/* 👇 The isolated Navigator handles all headers */}
      <CalendarNavigator viewMode={currentView} />


      {dialogMessage && (
        <DialogModal />
      )}


   

      {/* Grid (Click to open bar) */}
      <div className="view-container" style={{ paddingBottom: '100px' }}>
        
        {viewMode === 'day' && <CalendarDayView 
          onCellClick={handleCellClick} 
          onTaskClick={handleTaskClick} 
        />}

        {viewMode === 'week' && (
          <CalendarWeekView 
            onCellClick={handleCellClick} 
            onTaskClick={handleTaskClick} 
          />
        )}

        {viewMode === 'month' && (
          <CalendarMonthView 
            onCellClick={handleCellClick} 
            onTaskClick={handleTaskClick} 
          />
        )}

        {/*}
        {currentView === 'year' && (
          <CalendarYearView 
            onCellClick={handleCellClick} 
            onTaskClick={handleTaskClick} 
          />
        )}
          */}

      </div>

      {/* Slide up Bar */}
      <TaskCommandBar 
        isOpen={isBarOpen} 
        onClose={handleCloseBar} // 👈 This hides it after save
        selectedDate={clickedDate} 
        selectedHour={clickedHour} 
        editingTask={editingTask}
      />

      <TaskTypeManager /> 

    </div>


  );
};

export default CalendarMain;

 