import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { type RootState } from '../reducers';
import { addTask, updateTask } from '../actions/taskActions';
import { checkTaskOverlap, resolveOverlaps } from '../utils/dateUtils'; 
import { setError } from '../actions/errorActions'; 
import './TaskCommandBar.css';
import type { Task } from '../types';

interface TaskCommandBarProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: Date;
  selectedHour: number;
  editingTask: Task | null;
}

export const TaskCommandBar: React.FC<TaskCommandBarProps> = ({
  isOpen, onClose, selectedHour, selectedDate, editingTask
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
  const [startTimeStr, setStartTimeStr] = useState('');
  const [endTimeStr, setEndTimeStr] = useState('');

  // Sync state if a NEW cell is clicked
  useEffect(() => {
    if (isOpen) {

      if (editingTask) {

        // EDIT MODE
        const start = new Date(editingTask.from_datetime);
        const end = new Date(editingTask.to_datetime);
        setStartDateTime(start);
        setEndDateTime(end);
        setStartTimeStr(toTimeStr(start));
        setEndTimeStr(toTimeStr(end));
        setDetails(editingTask.task_details);
        setTypeId(editingTask.task_type_id);

      } else {

        const { start, end } = getInitialDates();
        setStartDateTime(start);
        setEndDateTime(end);
        setDetails('');
         
        if (taskTypes.length > 0 && !typeId) {
          setTypeId(taskTypes[0].id);
        }

      }

      setIsDateEditable(false);

      setTimeout(() => inputRef.current?.focus(), 350);
    }
  //  
  }, [isOpen, selectedHour, selectedDate, editingTask]);

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

    //const result = resolveOverlaps(startDateTime, endDateTime, allTasks, editingTask?.id );
    const { hasOverlap, conflictingTask } = checkTaskOverlap(
      startDateTime, 
      endDateTime, 
      allTasks, 
      editingTask?.id 
    );

    // 2. Block if overlap exists
    if (hasOverlap) {
      const conflictStart = conflictingTask ? new Date(conflictingTask.from_datetime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '';
      const conflictEnd = conflictingTask ? new Date(conflictingTask.to_datetime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '';
      
      // alert(`Time conflict! You already have a task from ${conflictStart} to ${conflictEnd}. You cannot log two tasks at the same time.`);
      
      dispatch(setError(`Time conflict! You already have a task from ${conflictStart} to ${conflictEnd}.`));

      return; 
    }

    if (editingTask) {
        dispatch(updateTask({
                ...editingTask,
                from_datetime: startDateTime.toISOString(),
                from_timestamp: startDateTime.getTime(),
                to_datetime: endDateTime.toISOString(),
                to_timestamp: endDateTime.getTime(),
                task_details: details.trim(),
                task_type_id: typeId,
              }));

    }
    else {

      dispatch(addTask(
      startDateTime.toISOString(), 
      endDateTime.toISOString(), 
      details.trim(), 
      typeId
    ));

    }
     
    
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


          {/* LEFT COLUMN (Auto width based on content) */}
          <div className="command-left-col">
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
              <button type="submit" 
                className="submit-btn" 
                disabled={!details.trim() || !typeId}>
                {editingTask ? 'Update' : 'Save'}
              </button>

            </div>

          </div>





          {/* RIGHT COLUMN (Takes all remaining space) */}
          <div className="command-right-col">
            <textarea 
              ref={inputRef as any}
              className="task-textarea" 
              placeholder="Enter task details..." 
              value={details} 
              onChange={(e) => setDetails(e.target.value)} 
            />
          </div>


 
           

        
        </form>
      </div>
    </>
  );
};