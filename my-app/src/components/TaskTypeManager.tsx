import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { type RootState } from '../reducers';
import { toggleTaskTypeManager } from '../actions/calendarActions';
//
import { addTaskTypeAsync, updateTaskTypeAsync } from '../actions/taskThunks'; 
import { X, Check, Plus } from 'lucide-react';
import './TaskTypeManager.css';
import { setError } from '../actions/errorActions';
import { ErrorMessages } from '../constants/errorMessages';
import { getErrorMessage } from '../utils/errorHandler';


export const TaskTypeManager: React.FC = () => {
  const dispatch = useDispatch();
  const isOpen = useSelector((state: RootState) => state.calendar.isTaskTypeManagerOpen);
  const taskTypes = useSelector((state: RootState) => state.tasks.taskTypes);

  const [newTypeName, setNewTypeName] = useState('');
  const [newTypeColor, setNewTypeColor] = useState('#3461ff');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  
  // Add loading states so buttons can disable while saving
  const [isSaving, setIsSaving] = useState(false);

  if (!isOpen) return null;

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTypeName.trim() || isSaving) return;
    
    setIsSaving(true);

    try {
      // 👈 Dispatch the async thunk (Laravel + Redux)
      await dispatch(addTaskTypeAsync(newTypeName.trim(), newTypeColor) as any);
      setNewTypeName(''); // Only clear on success
    } catch (error) {
      //alert("Failed to add task type. Please try again.");
      /*
      dispatch(
          setError('Failed to add task type, Network disconnected or server error.')
      );
      */
      dispatch(setError(getErrorMessage(error, ErrorMessages.TASK_TYPE_SAVE)));
            

    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveEdit = async (type: any) => {
    if (!editName.trim() || isSaving) return;

    setIsSaving(true);
    try {
      // 👈 Dispatch the async thunk (Laravel + Redux)
      await dispatch(updateTaskTypeAsync({ ...type, name: editName.trim() }) as any);
      setEditingId(null); // Only close edit mode on success
    } catch (error) {
      //alert("Failed to update task type. Please try again.");
      dispatch(setError(getErrorMessage(error, ErrorMessages.TASK_TYPE_SAVE)));
      
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={() => dispatch(toggleTaskTypeManager(false))}>
      <div className="modal-content type-manager-modal" onClick={(e) => e.stopPropagation()}>
        
        <div className="modal-header">
          <h2>Manage Task Types</h2>
          <button className="close-btn" onClick={() => dispatch(toggleTaskTypeManager(false))}>
            <X size={20} />
          </button>
        </div>

        <div className="type-list">
          {taskTypes.length === 0 && (
             <p style={{ textAlign: 'center', color: '#888', padding: '20px' }}>
               No task types yet. Add one below!
             </p>
          )}
          
          {taskTypes.map((type) => (
            <div key={type.id} className="type-row">
              <div className="color-indicator" style={{ backgroundColor: type.color || '#ccc' }} />
              
              {editingId === type.id ? (
                <div className="edit-mode">
                  <input 
                    type="text" 
                    value={editName} 
                    onChange={(e) => setEditName(e.target.value)}
                    autoFocus
                    disabled={isSaving}
                    onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit(type)}
                  />
                  <button 
                    className="save-btn" 
                    onClick={() => handleSaveEdit(type)}
                    disabled={isSaving}
                  >
                    <Check size={16} />
                  </button>
                  <button 
                    className="cancel-btn" 
                    onClick={() => setEditingId(null)}
                    disabled={isSaving}
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <div className="view-mode">
                  <span>{type.name}</span>
                  <button 
                    className="edit-trigger"
                    disabled={isSaving}
                    onClick={() => { setEditingId(type.id); setEditName(type.name); }}
                  >
                    Edit
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        <form className="add-type-form" onSubmit={handleAdd}>
          <input 
            type="color" 
            value={newTypeColor} 
            onChange={(e) => setNewTypeColor(e.target.value)} 
            disabled={isSaving}
            title="Pick a color"
          />
          <input 
            type="text" 
            placeholder="New task type..." 
            value={newTypeName}
            onChange={(e) => setNewTypeName(e.target.value)}
            disabled={isSaving}
          />
          <button type="submit" className="add-btn" disabled={isSaving || !newTypeName.trim()}>
            {isSaving ? 'Saving...' : <><Plus size={18} /> Add</>}
          </button>
        </form>

      </div>
    </div>
  );
};