import React, { useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { type RootState } from '../reducers';
import { CalendarMonthCell } from './CalendarMonthCell'; // 👈 Import the new cell
import type { Task } from '../types';
import './CalendarMonthView.css';
import './CalendarNavHeader.css';

interface Props {
  onCellClick: (date: Date, hour: number) => void;
  onTaskClick: (task: Task) => void;
}

const CalendarMonthView: React.FC<Props> = ({ onCellClick, onTaskClick }) => {
  const tasks = useSelector((state: RootState) => state.tasks.tasks);
  const [currentDate, setCurrentDate] = useState<Date>(() => new Date());

  const goPrevMonth = () => {
    const d = new Date(currentDate);
    d.setMonth(d.getMonth() - 1);
    setCurrentDate(d);
  };
  const goNextMonth = () => {
    const d = new Date(currentDate);
    d.setMonth(d.getMonth() + 1);
    setCurrentDate(d);
  };

  // Generate the 42 days
    const { calendarDays, rowCount } = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    
    const startingDayOfWeek = firstDayOfMonth.getDay(); 
    const daysInMonth = lastDayOfMonth.getDate();
    
    const days = [];
    
    // Prev month padding
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      days.push({ date: new Date(year, month - 1, prevMonthLastDay - i), isCurrentMonth: false });
    }
    
    // Current month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({ date: new Date(year, month, i), isCurrentMonth: true });
    }
    
    // Next month padding (only fill the current week)
    const remainingCellsInLastWeek = 7 - (days.length % 7);
    if (remainingCellsInLastWeek < 7) {
      for (let i = 1; i <= remainingCellsInLastWeek; i++) {
        days.push({ date: new Date(year, month + 1, i), isCurrentMonth: false });
      }
    }
    
    return { calendarDays: days, rowCount: Math.ceil(days.length / 7) };
  }, [currentDate]);



  // Helper to get tasks for a specific day
  const getTasksForDay = (day: Date) => {
    const dayStart = new Date(day);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(day);
    dayEnd.setHours(23, 59, 59, 999);

    return tasks.filter((t) => {
      return t.from_timestamp <= dayEnd.getTime() && t.to_timestamp >= dayStart.getTime();
    });
  };

  const monthName = currentDate.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="month-view">
      <div className="calendar-header-nav">
        <button className="nav-btn-left" onClick={goPrevMonth}>‹</button>
        <span className="nav-date-display">{monthName}</span>
        <button className="nav-btn-right" onClick={goNextMonth}>›</button>
      </div>

      <div className="month-days-header">
        {weekDays.map((day) => (
          <div key={day} className="month-day-label">{day}</div>
        ))}
      </div>

      <div 
        className="month-grid"   
        style={{ '--row-count': rowCount } as React.CSSProperties}
      >
        {calendarDays.map((item, index) => {
          const dayTasks = getTasksForDay(item.date);
          
          return (
            <CalendarMonthCell 
              key={index}
              date={item.date}
              isCurrentMonth={item.isCurrentMonth}
              dayTasks={dayTasks}
              onCellClick={onCellClick}
              onTaskClick={onTaskClick}
            />
          );
        })}
      </div>
    </div>
  );
};

export default CalendarMonthView;