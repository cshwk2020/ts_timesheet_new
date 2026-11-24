import React, { useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { type RootState } from '../reducers';
import { setCurrentDate } from '../actions/calendarActions';
import { Calendar } from 'lucide-react';
import './CalendarNavigator.css';

interface Props {
  viewMode: 'day' | 'week' | 'month';
}

export const CalendarNavigator: React.FC<Props> = ({ viewMode }) => {
  const dispatch = useDispatch();
  const currentDateStr = useSelector((state: RootState) => state.calendar.currentDate);
  const currentDate = new Date(currentDateStr);
  const dateInputRef = useRef<HTMLInputElement>(null);

  const handleNavigate = (direction: 'prev' | 'next') => {
    const d = new Date(currentDate);
    const multiplier = direction === 'next' ? 1 : -1;

    if (viewMode === 'day') d.setDate(d.getDate() + multiplier);
    else if (viewMode === 'week') d.setDate(d.getDate() + (7 * multiplier));
    else if (viewMode === 'month') {
      d.setDate(1); 
      d.setMonth(d.getMonth() + multiplier);
    }
    dispatch(setCurrentDate(d));
  };

  const handleDateJump = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.value) return;
    dispatch(setCurrentDate(new Date(`${e.target.value}T12:00:00`)));
  };

  let displayText = '';
  if (viewMode === 'day') {
    displayText = currentDate.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  } else if (viewMode === 'week') {
    const start = new Date(currentDate);
    start.setDate(start.getDate() - start.getDay());
    const end = new Date(start);
    end.setDate(end.getDate() + 6);
    displayText = `${start.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} - ${end.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}`;
  } else if (viewMode === 'month') {
    displayText = currentDate.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
  }

  // 👇 Trigger the native picker
  const openDatePicker = () => {
    if (dateInputRef.current) {
      try {
        dateInputRef.current.showPicker();
      } catch (err) {
        dateInputRef.current.focus();
      }
    }
  };

  return (
    <div className="calendar-header-nav">
      <button className="nav-btn-left" onClick={() => handleNavigate('prev')}>‹</button>
      
      <div className="nav-date-display">
        {/* 👇 The entire clickable pill */}
        <button 
          className="date-jump-pill" 
          onClick={openDatePicker}
          title="Jump to date"
        >
          <span className="header-plain-text">{displayText}</span>
          <Calendar size={16} className="jump-icon" />
        </button>

        {/* Hidden input absolutely positioned over the pill so the popup aligns */}
        <input 
          ref={dateInputRef}
          type="date" 
          value={currentDate.toISOString().split('T')[0]}
          onChange={handleDateJump}
          className="hidden-date-input"
        />
      </div>

      <button className="nav-btn-right" onClick={() => handleNavigate('next')}>›</button>
    </div>
  );
};