import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { type RootState } from '../reducers';
import { addTask, updateTask, deleteTask } from '../actions/taskActions';
import { ErrorMessages } from '../constants/errorMessages';
import { getErrorMessage } from '../utils/errorHandler';

import { checkTaskOverlap } from '../utils/dateUtils';
import { BlockingOverlay } from './BlockingOverlay';
import { StarRating } from './StarRating';

import { setError } from '../actions/errorActions';
import { showDialog } from '../actions/dialogActions';
import { LockedDate } from './LockedDate';
import { Check, Circle, Trash2 } from 'lucide-react';
import type { Task } from '../types';
import '../common.css';
import './LockedDate.css';
import './TaskCommandBar.css';
import { createTaskAsync, updateTaskAsync, deleteTaskAsync } from '../actions/taskThunks';

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
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Form State
  const [details, setDetails] = useState('');
  const [typeId, setTypeId] = useState('');
  const [isDone, setIsDone] = useState(false);
  const [startDateTime, setStartDateTime] = useState<Date>(new Date());
  const [endDateTime, setEndDateTime] = useState<Date>(new Date());
  const [startTimeStr, setStartTimeStr] = useState('');
  const [endTimeStr, setEndTimeStr] = useState('');
 
  // Helpers
  const toTimeStr = (d: Date) => `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;

  const [isSaving, setIsSaving] = useState(false);  

  const [difficulty, setDifficulty] = useState<number>(
    editingTask?.difficulty_level || 0
  );

  // 👇 Single, unified useEffect for initialization
  useEffect(() => {
    if (!isOpen) return;

    // 1. Ensure a task type is selected
    if (taskTypes.length > 0 && !typeId) {
      setTypeId(taskTypes[0].id);
    }

    // 2. Setup dates and fields based on Add vs Edit mode
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
      setIsDone(editingTask.status === 'done');
      setDifficulty(editingTask.difficulty_level);

    } else {
      // ADD MODE
      const start = new Date(selectedDate);
      start.setHours(selectedHour, 0, 0, 0);
      const end = new Date(start);
      end.setHours(end.getHours() + 1);

      setStartDateTime(start);
      setEndDateTime(end);
      setStartTimeStr(toTimeStr(start));
      setEndTimeStr(toTimeStr(end));
      setDetails('');
      
      // Smart Default: Past dates default to Done
      const isPast = start.getTime() < new Date().getTime();
      setIsDone(isPast);
      setDifficulty(0);
    }

    // 3. Focus the textarea after the slide-up animation
    setTimeout(() => inputRef.current?.focus(), 350);
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, editingTask, selectedDate, selectedHour]); 

  const handleStartTimeChange = (timeStr: string) => {
    setStartTimeStr(timeStr);
    const [hours, minutes] = timeStr.split(':').map(Number);
    if (isNaN(hours) || isNaN(minutes)) return;

    const newStart = new Date(startDateTime);
    newStart.setHours(hours, minutes);
    setStartDateTime(newStart);
  };

  const handleEndTimeChange = (timeStr: string) => {
    setEndTimeStr(timeStr);
    const [hours, minutes] = timeStr.split(':').map(Number);
    if (isNaN(hours) || isNaN(minutes)) return;

    const newEnd = new Date(endDateTime);
    newEnd.setHours(hours, minutes);
    setEndDateTime(newEnd);
  };


  const handleDeleteClick = () => {

      if (!editingTask) return;
        
    // 1. Clear any old errors so the banner is empty
    dispatch({ type: 'CLEAR_ERROR' });

    // 2. Show the dialog
    dispatch(
      showDialog(
        'Delete Task?',
        'Are you sure you want to delete this task? This action cannot be undone.',
        'Delete',
        async () => {
          // 3. This runs when the user clicks "Delete" in the dialog
          //setIsSaving(true);
          try {
            await dispatch(deleteTaskAsync(editingTask.id) as any);
            onClose(); // Close the slide-up form on success
          } catch (error) {
            console.error("Delete failed:", error);
            
            // 4. Dispatch the error. The Global ErrorBanner will catch this.
            /*
            dispatch(
              setError('Failed to delete task. Network disconnected or server error.')
            );
            */
            dispatch(setError(getErrorMessage(error, ErrorMessages.TASK_DELETE)));

            
            // Important: If your Dialog component automatically hides itself
            // when the callback finishes, the error banner will still show at the top of the screen.
          } finally {
            //setIsSaving(false);
          }
        }
      )
    );
};


  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!details.trim() || !typeId || isSaving) return;

    // Check for overlaps
    const { hasOverlap, conflictingTask } = checkTaskOverlap(
      startDateTime, endDateTime, allTasks, editingTask?.id 
    );

    if (hasOverlap) {
      const conflictStart = conflictingTask ? new Date(conflictingTask.from_datetime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '';
      const conflictEnd = conflictingTask ? new Date(conflictingTask.to_datetime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '';
      dispatch(setError(`Time conflict! You already have a task from ${conflictStart} to ${conflictEnd}.`));
      
      return; 
    }

    const finalStatus = isDone ? 'done' : 'planned';

    // Prepare the payload based on your TS interface
    const taskPayload = {
      ...editingTask,
      from_datetime: startDateTime.toISOString(),
      from_timestamp: startDateTime.getTime(),
      to_datetime: endDateTime.toISOString(),
      to_timestamp: endDateTime.getTime(),
      task_details: details.trim(),
      task_type_id: typeId,
      status: finalStatus,
      difficulty_level: difficulty,
    };


    console.log(`DEBUG...handleSubmit...taskPayload==`, taskPayload);


    //setIsSaving(true); // 👈 Start blocking overlay

    try {
      if (editingTask) {
        // 👈 Dispatch thunk (no dispatch argument needed)
        await dispatch(updateTaskAsync(taskPayload as Task) as any);
      } else {
        // 👈 Dispatch thunk (no dispatch argument needed)
        await dispatch(createTaskAsync(taskPayload as Task) as any);
      }
      
      onClose(); // Only close modal on success

    } catch (error) {
      // The thunk throws an error if Laravel rejects it (e.g., 500 or 403)
      //dispatch(setError("Failed to save task. Please check the server and try again."));
      dispatch(setError(getErrorMessage(error, ErrorMessages.TASK_SAVE)));
      
      
      onClose();
      
    } finally {
      //setIsSaving(false); // 👈 Stop blocking overlay
    }
  };


  return (
    <>
    <div className="task-command-bar-wrapper">
      {/* 👈 Show the overlay while talking to Laravel */}
      <BlockingOverlay isLoading={isSaving} text="Saving to Server..." />
      
      <div className={`command-bar-backdrop ${isOpen ? 'open' : ''}`} onClick={onClose} />

      <div className={`command-bar-wrapper ${isOpen ? 'open' : ''}`}>
        <form 
          className="command-bar-content" 
          onSubmit={handleSubmit}
          onClick={(e) => e.stopPropagation()}
        >
          {/* LEFT COLUMN */}
          <div className="command-left-col">
            <div className="time-section">
              <div className="time-group">
                <label>Start</label>
                <div className="time-inputs">
                  <input type="time" value={startTimeStr} onChange={(e) => handleStartTimeChange(e.target.value)} required />
                  <LockedDate date={startDateTime} onChange={(newDate) => setStartDateTime(newDate)} />
                </div>
              </div>

              <span className="time-arrow">➔</span>

              <div className="time-group">
                <label>End</label>
                <div className="time-inputs">
                  <input type="time" value={endTimeStr} onChange={(e) => handleEndTimeChange(e.target.value)} required />
                  <LockedDate date={endDateTime} onChange={(newDate) => setEndDateTime(newDate)} />
                </div>
              </div>
            </div>

            <div className="task-section">
              <select className="type-select" value={typeId} onChange={(e) => setTypeId(e.target.value)}>
                {taskTypes.map((t) => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>


              <div className="util-row-wrapper">

                <div>
                  <label className="status-checkbox-label">
                    <input 
                      type="checkbox" 
                      checked={isDone} 
                      onChange={(e) => setIsDone(e.target.checked)} 
                      className="hidden-checkbox"
                    />
                    <div className="custom-checkbox">
                      {isDone ? <Check size={14} /> : <Circle size={14} />}
                    </div>
                    <span className="checkbox-text">{isDone ? 'Completed' : 'Planned'}</span>
                  </label>
                </div>

                <div>
                  <StarRating 
                    value={difficulty} 
                    onChange={(val:number) => setDifficulty(val)} 
                  />
                </div>


              </div>
               
                
              <button type="submit" className="submit-btn" disabled={!details.trim() || !typeId}>
                {editingTask ? 'Update' : 'Save'}
              </button>
            </div>
          </div>



          {/* RIGHT COLUMN */}
          <div className="command-right-col">
            {/* Delete Button (Only in Edit Mode) */}
            {editingTask && (
              <div className='util-row_item-rightmost'>
                <button 
                  type="button" 
                  className="delete-icon-btn" 
                  onClick={handleDeleteClick}
                  title="Delete Task"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            )}

            <textarea 
              ref={inputRef}
              className="task-textarea" 
              placeholder="Enter task details..." 
              value={details} 
              onChange={(e) => setDetails(e.target.value)} 
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e as any);
                }
              }}
            />
          </div>
        </form>
      </div>
      </div>
    </>
  );
};