import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { type RootState } from '../reducers';
import { toggleTaskTypeManager } from '../actions/calendarActions';
import { addTaskType, updateTaskType } from '../actions/taskActions';
import { X, Check, Plus } from 'lucide-react';
import './TaskTypeManager.css';

export const TaskTypeManager: React.FC = () => {
  const dispatch = useDispatch();
  const isOpen = useSelector((state: RootState) => state.calendar.isTaskTypeManagerOpen);
  const taskTypes = useSelector((state: RootState) => state.tasks.taskTypes);

  const [newTypeName, setNewTypeName] = useState('');
  const [newTypeColor, setNewTypeColor] = useState('#3461ff'); // Default blue
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  if (!isOpen) return null;

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTypeName.trim()) return;
    dispatch(addTaskType(newTypeName.trim(), newTypeColor));
    setNewTypeName('');
  };

  const handleSaveEdit = (type: any) => {
    if (!editName.trim()) return;
    dispatch(updateTaskType({ ...type, name: editName.trim() }));
    setEditingId(null);
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
                    onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit(type)}
                  />
                  <button className="save-btn" onClick={() => handleSaveEdit(type)}><Check size={16} /></button>
                  <button className="cancel-btn" onClick={() => setEditingId(null)}><X size={16} /></button>
                </div>
              ) : (
                <div className="view-mode">
                  <span>{type.name}</span>
                  <button 
                    className="edit-trigger"
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
            title="Pick a color"
          />
          <input 
            type="text" 
            placeholder="New task type..." 
            value={newTypeName}
            onChange={(e) => setNewTypeName(e.target.value)}
          />
          <button type="submit" className="add-btn"><Plus size={18} /> Add</button>
        </form>

      </div>
    </div>
  );
};