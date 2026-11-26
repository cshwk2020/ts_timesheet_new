import React, { useState } from 'react';
import { apiClient, ApiError } from '../api/client';
import { BlockingOverlay } from './BlockingOverlay';
import './TaskForm.css';

export const TaskForm = () => {
  const [title, setTitle] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setToast(null);

    try {
      // Notice: NO user_id is sent. Laravel injects it from the JWT.
      await apiClient('/tasks', {
        method: 'POST',
        body: JSON.stringify({ 
            task_details: title,
            from_datetime: new Date().toISOString(),
            to_datetime: new Date().toISOString(),
            from_timestamp: Date.now(),
            to_timestamp: Date.now() + 3600000,
            task_type_id: "some-task-type-uuid", // In real usage, pass a selected type
            status: 'planned'
        }),
      });

      setToast({ type: 'success', msg: 'Task saved successfully!' });
      setTitle('');
    } catch (error) {
      const message = error instanceof ApiError ? error.message : 'Network error';
      setToast({ type: 'error', msg: `Save failed: ${message}` });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="task-form-container">
      <BlockingOverlay isLoading={isSaving} text="Saving Task..." />

      <h2 className="task-form-title">New Task</h2>
      
      {toast && (
        <div className={`task-form-toast ${toast.type}`}>
          {toast.msg}
        </div>
      )}

      <form onSubmit={handleSave}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={isSaving}
          placeholder="Task Details..."
          className="task-form-input"
          required
        />
        <button
          type="submit"
          disabled={isSaving || !title}
          className="task-form-button"
        >
          Save Task
        </button>
      </form>
    </div>
  );
};