import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../reducers';
import './CalendarDayView.css';

interface Props {
  // Tell the parent which date and hour was clicked
  onCellClick: (date: Date, hour: number) => void;
}

const HOURS = Array.from({ length: 24 }, (_, i) => i);

const CalendarDayView: React.FC<Props> = ({ onCellClick }) => {
  const tasks = useSelector((state: RootState) => state.tasks.tasks);
  
  // Keep the date local to this view for navigation
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

  // Helper to check if a task overlaps with a specific hour
  const getTasksForHour = (date: Date, hour: number) => {
    const cellStart = new Date(date);
    cellStart.setHours(hour, 0, 0, 0);
    const cellEnd = new Date(date);
    cellEnd.setHours(hour, 59, 59, 999);

    return tasks.filter((t) => {
      const taskStart = new Date(t.from_datetime).getTime();
      const taskEnd = new Date(t.to_datetime).getTime();
      
      // Overlap check: Task starts before cell ends AND ends after cell starts
      return taskStart <= cellEnd.getTime() && taskEnd >= cellStart.getTime();
    });
  };

  return (
    <div className="day-view">
      {/* Header for day navigation */}
      <div className="day-view-header">
        <button onClick={goPrevDay} aria-label="Previous day">‹</button>
        <div className="day-view-date">
          {selectedDate.toLocaleDateString(undefined, {
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
          })}
        </div>
        <button onClick={goNextDay} aria-label="Next day">›</button>
      </div>

      <div className="day-view-hours">
        {HOURS.map((hour) => {
          const cellTasks = getTasksForHour(selectedDate, hour);
          
          // Create a date object representing this exact cell's time
          const cellDate = new Date(selectedDate);
          cellDate.setHours(hour, 0, 0, 0);

          return (
            <div 
              key={hour} 
              className="hour-row clickable"
              onClick={() => onCellClick(cellDate, hour)}
            >
              <div className="hour-label">{String(hour).padStart(2, '0')}:00</div>
              
              <div className="hour-display">
                {cellTasks.length > 0 ? (
                  cellTasks.map((t) => {
                    const start = new Date(t.from_datetime);
                    const end = new Date(t.to_datetime);
                    
                    // Is this the first hour of the task?
                    const isStart = start.getHours() === hour && start.getDate() === cellDate.getDate();
                    
                    // Format start time for the badge
                    const timeLabel = isStart 
                      ? `${String(start.getHours()).padStart(2,'0')}:${String(start.getMinutes()).padStart(2,'0')}` 
                      : '↳';

                    return (
                      <div key={t.id} className={`task-line ${!isStart ? 'continued' : ''}`}>
                        <span className="task-time">{timeLabel}</span>
                        <span className="task-details">{t.task_details}</span>
                      </div>
                    );
                  })
                ) : (
                  <span className="empty-placeholder">Click to add task…</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarDayView;