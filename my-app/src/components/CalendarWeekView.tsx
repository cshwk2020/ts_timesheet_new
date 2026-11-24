import React, { useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { type RootState } from '../reducers';
import { CalendarCell } from './CalendarCell';
import type { Task } from '../types';
import './CalendarNavHeader.css';
import './CalendarWeekView.css';

interface Props {
  onCellClick: (date: Date, hour: number) => void;
  onTaskClick: (task: Task) => void;
}

const HOURS = Array.from({ length: 24 }, (_, i) => i);

const CalendarWeekView: React.FC<Props> = ({ onCellClick, onTaskClick }) => {
  const tasks = useSelector((state: RootState) => state.tasks.tasks);
  
  // Inside the component:
  const currentDateStr = useSelector((state: RootState) => state.calendar.currentDate);
  const currentDate = new Date(currentDateStr);
 
  // Calculate the 7 days of the current week (Sunday to Saturday)
  const weekDays = useMemo(() => {
    const days = [];
    const startOfWeek = new Date(currentDate);
    // Get current day of week (0 = Sun, 1 = Mon, etc.) and shift back to Sunday
    const dayOfWeek = startOfWeek.getDay();
    startOfWeek.setDate(startOfWeek.getDate() - dayOfWeek);

    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(day.getDate() + i);
      days.push(day);
    }
    return days;
  }, [currentDate]);

   

  // Helper to find tasks for a specific cell (day + hour)
  const getTasksForCell = (day: Date, hour: number) => {
    const cellStart = new Date(day);
    cellStart.setHours(hour, 0, 0, 0);
    const cellEnd = new Date(day);
    cellEnd.setHours(hour + 1, 0, 0, 0); 

    return tasks.filter((t) => {
      return t.from_timestamp < cellEnd.getTime() && t.to_timestamp > cellStart.getTime();
    });
  };

  return (
    <div className="week-view">

      {/* The Grid */}
      <div className="week-grid-body">
        {HOURS.map((hour) => (
          <div key={hour} className="week-row">
            {/* Column 1: Time Label */}
            <div className="week-hour-label">
              {String(hour).padStart(2, '0')}:00 - {String((hour + 1) % 24).padStart(2, '0')}:00
            </div>

            {/* Columns 2-8: The 7 Days */}
            {weekDays.map((day, dayIndex) => {
              const cellTasks = getTasksForCell(day, hour);
              
              // Create the specific Date object for this cell context
              const cellDate = new Date(day);
              cellDate.setHours(hour, 0, 0, 0);

              return (
                <div 
                  key={dayIndex} 
                  className="week-cell"
                  onClick={() => onCellClick(cellDate, hour)}
                >
                  {cellTasks.map((t) => (
                    <CalendarCell 
                      key={t.id} 
                      task={t} 
                      cellDate={cellDate} 
                      hour={hour} 
                      onTaskClick={onTaskClick} 
                    />
                  ))}
                  
                  {/* Only show the "+" target if there's space */}
                  <div className="empty-cell-target">
                     {cellTasks.length === 0 && <span className="empty-placeholder">+</span>}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CalendarWeekView;