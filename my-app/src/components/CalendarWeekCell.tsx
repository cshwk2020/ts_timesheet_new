import React from 'react';
import type { Task } from '../types';
import { toggleTaskStatus } from '../actions/taskActions';
import { Check, Circle } from 'lucide-react';
import { useDispatch } from 'react-redux';

interface CalendarWeekCellProps {
  task: Task;
  cellDate: Date;
  hour: number;
  onTaskClick: (task: Task) => void;
}

export const CalendarWeekCell: React.FC<CalendarWeekCellProps> = ({ task, cellDate, hour, onTaskClick }) => {
  const dispatch = useDispatch();

  const start = new Date(task.from_datetime);
  const formatTime = (d: Date) => 
    `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  
  const rangeLabel = `[${formatTime(start)}]`;

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(toggleTaskStatus(task.id));
  };

  return (
    <div 
      className={`task-line week-task ${task.status === 'planned' ? 'is-planned' : 'is-done'}`}
      onClick={(e) => {
        e.stopPropagation();
        onTaskClick(task);
      }}
    >
      {/* Top Row: Checkbox + Time */}
      <div className="week-task-header">
        <div className="task-status-toggle" onClick={handleToggle}>
          {task.status === 'done' ? (
            <Check size={12} className="icon-done" />
          ) : (
            <Circle size={12} className="icon-planned" />
          )}
        </div>
        
      </div>

      {/* Bottom Row: Task Details */}
      <div className="task-details">
        {task.task_details}
      </div>
    </div>
  );
};

