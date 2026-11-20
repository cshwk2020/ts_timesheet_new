import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../reducers';
import { CalendarCell } from './CalendarCell';
import './CalendarDayView.css';
import type { Task } from '../types';

interface Props {
  onCellClick: (date: Date, hour: number) => void;
  onTaskClick: (task: Task) => void; 
}

const HOURS = Array.from({ length: 24 }, (_, i) => i);

const CalendarDayView: React.FC<Props> = ({ onCellClick, onTaskClick }) => {
  const tasks = useSelector((state: RootState) => state.tasks.tasks);
  
  // 
  const [selectedDate, setSelectedDate] = useState<Date>(() => new Date());

  const goPrevDay = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() - 1);
    setSelectedDate(d);
  };

  const goNextDay = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + 1);
    setSelectedDate(d);
  };

  //  
  const getTasksForHour = (date: Date, hour: number) => {
    const cellStart = new Date(date);
    cellStart.setHours(hour, 0, 0, 0);
    const cellEnd = new Date(date);
    cellEnd.setHours(hour + 1, 0, 0, 0);  

    return tasks.filter((t) => {
      return t.from_timestamp < cellEnd.getTime() && t.to_timestamp > cellStart.getTime();
    });
  };

return (
    <div className="day-view">
      <div className="day-view-hours">
        {HOURS.map((hour) => {
          const cellTasks = getTasksForHour(selectedDate, hour);
          const cellDate = new Date(selectedDate);
          cellDate.setHours(hour, 0, 0, 0);

          return (
            <div key={hour} className="hour-row"> {/* 👈 Removed onClick from here */}
              
              {/* Hour label does nothing on click */}
             <div className="hour-label">
              {String(hour).padStart(2, '0')}:00 - {String((hour + 1) % 24).padStart(2, '0')}:00
            </div>
              
              {/* The old task area */}
              <div className="hour-display" style={{ display: 'flex', flexDirection: 'column', gap: '4px', minHeight: '100%' }}>
                
                 {cellTasks.map((t) => (
                    <CalendarCell 
                      key={t.id} 
                      task={t} 
                      cellDate={cellDate} 
                      hour={hour} 
                      onTaskClick={onTaskClick} 
                    />
                  ))}

                 {/* 👇 The "Add" target is a growing empty space underneath the tasks */}
                 <div 
                    className="empty-cell-target" 
                    onClick={() => onCellClick(cellDate, hour)}
                    style={{ flex: 1, cursor: 'pointer', minHeight: '24px' }}
                  >
                    {cellTasks.length === 0 && (
                      <span className="empty-placeholder">Click to add task…</span>
                    )
                  }
                  </div>

                </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarDayView;

