import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../reducers';
import { hideDialog } from '../actions/dialogActions';
import './DialogModal.css'; // Keep the same CSS
import { AlertTriangle, Trash2 } from 'lucide-react'; 

export const DialogModal: React.FC = () => {
  const dispatch = useDispatch();
  const dialog = useSelector((state: RootState) => state.dialog); // Or whatever you named the slice

  if (!dialog.isOpen) return null;

  const handleConfirm = () => {
    // 👇 The magic: just execute the callback if it exists!
    if (dialog.onConfirm) {
      dialog.onConfirm();
    }
    dispatch(hideDialog());
  };

  const handleCancel = () => {
    dispatch(hideDialog());
  };

  return (
    <div className="dialog-modal-backdrop" onClick={handleCancel}>
      <div className="dialog-modal-box" onClick={(e) => e.stopPropagation()}>
        
        <div className="dialog-icon">
          {dialog.type === 'error' ? '⚠️' : '🗑️'}
        </div>
        
        <h3 className="dialog-title">{dialog.title}</h3>
        <p className="dialog-text">{dialog.message}</p>
        
        <div className="dialog-modal-button-group">
          {dialog.type === 'confirm' && (
            <button className="dialog-close-btn" onClick={handleCancel}>
               Cancel
            </button>
          )}
          
          <button 
            className={`dialog-close-btn ${dialog.type === 'confirm' ? 'delete-confirm-btn' : ''}`}
            onClick={handleConfirm}
          >
            {dialog.type === 'confirm' ? (dialog.confirmText || 'Confirm') : 'Got it'}

            
          </button>
        </div>

      </div>
    </div>
  );
};