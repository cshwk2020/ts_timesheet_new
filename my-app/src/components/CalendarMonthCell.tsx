import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { CalendarCell } from './CalendarCell';
import type { Task } from '../types';

interface Props {
  date: Date;
  isCurrentMonth: boolean;
  dayTasks: Task[];
  onCellClick: (date: Date, hour: number) => void;
  onTaskClick: (task: Task) => void;
}

export const CalendarMonthCell: React.FC<Props> = ({ 
  date, isCurrentMonth, dayTasks, onCellClick, onTaskClick 
}) => {
  const [hoveredHour, setHoveredHour] = useState<number | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  // 👇 1. Calculate hour based on HORIZONTAL (X) position
  const handleTimeBarInteraction = (e: React.MouseEvent<HTMLDivElement>, isClick: boolean = false) => {
    if (!isCurrentMonth) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const width = rect.width;

    // Map X from 0 -> width to 0 -> 23 hours
    const ratio = Math.max(0, Math.min(1, x / width));
    let hour = Math.floor(ratio * 24);
    if (hour === 24) hour = 23;

    setMousePos({ x: e.clientX, y: e.clientY });
    setHoveredHour(hour);

    if (isClick) {
      onCellClick(date, hour);
    }
  };

  const timeHint = hoveredHour !== null && isCurrentMonth
    ? `${String(hoveredHour).padStart(2, '0')}:00 - ${String((hoveredHour + 1) % 24).padStart(2, '0')}:00`
    : null;

  return (
    <div className={`month-cell ${!isCurrentMonth ? 'disabled' : ''}`}>
      
      {/* 👇 2. The Horizontal Time Bar (Top 20% of cell) */}
      <div 
        className="month-time-bar"
        onMouseMove={(e) => handleTimeBarInteraction(e, false)}
        onMouseLeave={() => setHoveredHour(null)}
        onClick={(e) => handleTimeBarInteraction(e, true)}
        onMouseDown={() => setIsDragging(true)}
        onMouseUp={() => setIsDragging(false)}
      >
        {/* Visual indicator of the drag zone */}
        <div className="drag-hint">+ Add</div>
      </div>

      {/* Date Number */}
     
      <div className="month-date-number">
         <span>{date.getDate()}</span>
        {date.getDate() === 1 && (
          <span className="month-name-label">
            {date.toLocaleDateString(undefined, { month: 'short' })}
          </span>
        )}
      </div>
      
      {/* 👇 3. Task Area (Bottom 80% of cell) */}
      <div className="month-cell-tasks">
        {dayTasks.slice(0, 4).map((t) => (
          <CalendarCell 
            key={t.id} 
            task={t} 
            cellDate={date} 
            hour={new Date(t.from_datetime).getHours()} 
            onTaskClick={onTaskClick} 
          />
        ))}
        {dayTasks.length > 4 && (
          <div className="more-tasks">+ {dayTasks.length - 4} more</div>
        )}
      </div>

      {/* The Floating Tooltip */}
      {timeHint && (
        <div 
          className="month-time-hint"
          style={{ left: mousePos.x, top: mousePos.y - 12 }}
        >
          <Plus size={12} strokeWidth={3} className="hint-icon" />
          <span>{timeHint}</span>
        </div>
      )}
    </div>
  );
};