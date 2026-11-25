// src/components/CalendarCell.tsx
import React from 'react';
import type { Task } from '../types';
import { toggleTaskStatus } from '../actions/taskActions';
import { Check, Circle } from 'lucide-react';
import { useDispatch } from 'react-redux';

interface CalendarCellProps {
  task: Task;
  cellDate: Date;
  hour: number;
  onTaskClick: (task: Task) => void;
}

export const CalendarCell: React.FC<CalendarCellProps> = ({ task, cellDate, hour, onTaskClick }) => {
  const dispatch = useDispatch();

  const start = new Date(task.from_datetime);
  const end = new Date(task.to_datetime);

  // Format helper to keep it clean (e.g., 06:00)
  const formatTime = (d: Date) => 
    `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;

  const rangeLabel = `[${formatTime(start)}-${formatTime(end)}]`;

  const cellStart = new Date(cellDate);
  cellStart.setHours(hour, 0, 0, 0);
  const cellEnd = new Date(cellDate);
  cellEnd.setHours(hour + 1, 0, 0, 0);

  const overlapStart = Math.max(start.getTime(), cellStart.getTime());
  const overlapEnd = Math.min(end.getTime(), cellEnd.getTime());

  const minutesInCell = Math.max(0, Math.round((overlapEnd - overlapStart) / 60000));
  const formattedMinutes = String(minutesInCell).padStart(2, '0');

  const handleToggle = (e: React.MouseEvent) => {
    console.log(`handleToggle...0...`, handleToggle);
    e.stopPropagation(); 
    e.preventDefault(); // Add this just in case
    
    console.log("🔴 CHECKBOX CLICKED!", task.id); // 👈 ADD THIS
    
    dispatch(toggleTaskStatus(task.id));
  };

  return (
    <div 
      // 👇 Add dynamic classes for the visual style
      className={`task-line ${task.status === 'planned' ? 'is-planned' : 'is-done'}`}
      onClick={(e) => {
        console.log('TEST...');
        e.stopPropagation();
        onTaskClick(task);
      }}
    >
         
      {/* 👇 Clickable Status Icon */}
      <div className="task-status-toggle" onClick={handleToggle}>
        {task.status === 'done' ? (
          <Check size={14} className="icon-done" />
        ) : (
          <Circle size={14} className="icon-planned" />
        )}
      </div>

 
      
      <span className="task-details">{task.task_details}</span>
      
      <span className="task-duration">
        <span>{formattedMinutes} min</span>
      </span>
      
    </div>
  );
};