import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { type RootState } from '../reducers';
import { addTask } from '../actions/taskActions';
import { resolveOverlaps } from '../utils/dateUtils'; 
import './TaskCommandBar.css';

interface TaskCommandBarProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: Date;
  selectedHour: number;
}

export const TaskCommandBar: React.FC<TaskCommandBarProps> = ({ 
  isOpen, onClose, selectedHour, selectedDate 
}) => {
  
  const dispatch = useDispatch();
  const taskTypes = useSelector((state: RootState) => state.tasks.taskTypes);
  const allTasks = useSelector((state: RootState) => state.tasks.tasks); 

  const inputRef = useRef<HTMLInputElement>(null);

  const [details, setDetails] = useState('');
  const [typeId, setTypeId] = useState('');
  const [isDateEditable, setIsDateEditable] = useState(false);
 
useEffect(() => {
  if (taskTypes.length > 0 && !typeId) {
    setTypeId(taskTypes[0].id);
  }
}, [taskTypes, typeId]);

  // 1. Derive the exact Start and End Dates directly from props
  const getInitialDates = () => {
    if (!selectedDate) return { start: new Date(), end: new Date() };
    const start = new Date(selectedDate);
    start.setHours(selectedHour, 0, 0, 0);
    const end = new Date(start);
    end.setHours(end.getHours() + 1);
    return { start, end };
  };

  const initDates = getInitialDates();
  const [startDateTime, setStartDateTime] = useState<Date>(initDates.start);
  const [endDateTime, setEndDateTime] = useState<Date>(initDates.end);

  // Sync state if a NEW cell is clicked
  useEffect(() => {
    if (isOpen) {
      const { start, end } = getInitialDates();
      setStartDateTime(start);
      setEndDateTime(end);
      setDetails('');
      setIsDateEditable(false);
      
      if (taskTypes.length > 0 && !typeId) {
        setTypeId(taskTypes[0].id);
      }

      // Delay focus so it waits for the slide animation
      setTimeout(() => inputRef.current?.focus(), 350);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, selectedHour, selectedDate]);

  const toDateStr = (d: Date) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };

  const toTimeStr = (d: Date) => {
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  };

    const handleStartTimeChange = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    const newStart = new Date(startDateTime);
    newStart.setHours(hours, minutes);
    
    setStartDateTime(newStart);

    // Check if the new start time is AFTER the existing end time (on the same date)
    // If so, the user is probably trying to extend the task, so we push the end time forward.
    /*
    if (newStart.getTime() >= endDateTime.getTime()) {
      const newEnd = new Date(newStart);
      newEnd.setHours(newEnd.getHours() + 1); // Default to 1 hour duration
      setEndDateTime(newEnd);
    }
    */
    
     
  };

  const handleEndTimeChange = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    const newEnd = new Date(endDateTime);
    
    // 1. Set the new time on the EXISTING end date
    newEnd.setHours(hours, minutes);

    // 2. Compare only the Time portions (HH:mm) to see if the user is trying to cross midnight
    const startTimeVal = startDateTime.getHours() * 60 + startDateTime.getMinutes();
    const endTimeVal = hours * 60 + minutes;

    setEndDateTime(newEnd);
    
    /*
    if (endTimeVal < startTimeVal) {
      // User typed an End Time earlier than Start Time (e.g., Start 23:00, End 02:00)
      // Set end date to the day AFTER the start date.
      newEnd.setFullYear(startDateTime.getFullYear(), startDateTime.getMonth(), startDateTime.getDate());
      newEnd.setDate(newEnd.getDate() + 1);
    } else {
      // User typed an End Time later than Start Time (e.g., Start 10:00, End 12:00)
      // Force the end date to match the start date exactly (prevents the weird 1-day jump bug)
      newEnd.setFullYear(startDateTime.getFullYear(), startDateTime.getMonth(), startDateTime.getDate());
    }
    */
    
     
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!details.trim() || !typeId) return;

    const result = resolveOverlaps(startDateTime, endDateTime, allTasks);

    if (!result) {
      alert("This task cannot fit into the selected time slot because it overlaps with existing tasks.");
      return;
    }

    dispatch(addTask(
      startDateTime.toISOString(), 
      endDateTime.toISOString(), 
      details.trim(), 
      typeId
    ));
    
    onClose(); // This triggers the slide down
  };

  return (
    <>
      {/* 1. Backdrop: Catches clicks outside to close the bar */}
      <div 
        className={`command-bar-backdrop ${isOpen ? 'open' : ''}`} 
        onClick={onClose} 
      />

      {/* 2. The actual Slide-Up Bar */}
      <div className={`command-bar-wrapper ${isOpen ? 'open' : ''}`}>
        <form 
          className="command-bar-content" 
          onSubmit={handleSubmit}
          onClick={(e) => e.stopPropagation()} // Stop clicks inside the form from closing it
        >
          
          {/* Time Section */}
          <div className="time-section">

            <div className="time-group">
              <label>Start</label>
              <div className="time-inputs">
                <input type="time" value={toTimeStr(startDateTime)} onChange={(e) => handleStartTimeChange(e.target.value)} required />
                <div className={`date-badge ${isDateEditable ? 'editable' : ''}`} onClick={() => setIsDateEditable(!isDateEditable)}>
                  {isDateEditable ? (
                    <input type="date" value={toDateStr(startDateTime)} onChange={(e) => {
                        if(!e.target.value) return;
                        setStartDateTime(new Date(`${e.target.value}T${toTimeStr(startDateTime)}:00`));
                    }} autoFocus onBlur={() => setIsDateEditable(false)} />
                  ) : (
                    <span>{toDateStr(startDateTime).slice(5).replace('-', '/')} 🔒</span>
                  )}
                </div>
              </div>
            </div>

            <span className="time-arrow">➔</span>

            <div className="time-group">
              <label>End</label>
              <div className="time-inputs">
                <input type="time" value={toTimeStr(endDateTime)} onChange={(e) => handleEndTimeChange(e.target.value)} required />
                <div className={`date-badge ${isDateEditable ? 'editable' : ''}`} onClick={() => setIsDateEditable(!isDateEditable)}>
                  {isDateEditable ? (
                    <input type="date" value={toDateStr(endDateTime)} onChange={(e) => {
                        if(!e.target.value) return;
                        setEndDateTime(new Date(`${e.target.value}T${toTimeStr(endDateTime)}:00`));
                    }} onBlur={() => setIsDateEditable(false)} />
                  ) : (
                    <span>{toDateStr(endDateTime).slice(5).replace('-', '/')} 🔒</span>
                  )}
                </div>
              </div>
            </div>
          </div>

         
                     
          <div className="task-section">
            <input 
              ref={inputRef}
              type="text" 
              className="task-input" 
              placeholder="What are you doing?" 
              value={details} 
              onChange={(e) => setDetails(e.target.value)} 
            />
            <select 
              className="type-select" 
              value={typeId} 
              onChange={(e) => setTypeId(e.target.value)}
            >
              {taskTypes.map((t) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
            
            {/* 👇 ADDED SUBMIT BUTTON */}
            <button 
              type="submit" 
              className="submit-btn"
              disabled={!details.trim() || !typeId}
            >
              Save
            </button>
          </div>

        
        </form>
      </div>
    </>
  );
};