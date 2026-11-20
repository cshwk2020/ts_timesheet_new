// src/components/CalendarCell.tsx
import React from 'react';
import type { Task } from '../types';

interface CalendarCellProps {
  task: Task;
  cellDate: Date;
  hour: number;
  onTaskClick: (task: Task) => void;
}

export const CalendarCell: React.FC<CalendarCellProps> = ({ task, cellDate, hour, onTaskClick }) => {
  
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

    
    return (
        <div 
        className="task-line"
        onClick={(e) => {
            e.stopPropagation();
            onTaskClick(task);
        }}
        >
     
        <span className="task-duration">{minutesInCell} min</span>
        <span className="task-details">{task.task_details}</span>
       
        </div>
    );
};