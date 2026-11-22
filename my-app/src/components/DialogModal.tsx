import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../reducers';
import { hideDialog } from '../actions/dialogActions';
import './ErrorModal.css'; // Keep the same CSS
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
    <div className="error-modal-backdrop" onClick={handleCancel}>
      <div className="error-modal-box" onClick={(e) => e.stopPropagation()}>
        
        <div className="error-icon">
          {dialog.type === 'error' ? '⚠️' : '🗑️'}
        </div>
        
        <h3 className="error-title">{dialog.title}</h3>
        <p className="error-text">{dialog.message}</p>
        
        <div className="error-modal-button-group">
          {dialog.type === 'confirm' && (
            <button className="error-close-btn" onClick={handleCancel}>
               Cancel
            </button>
          )}
          
          <button 
            className={`error-close-btn ${dialog.type === 'confirm' ? 'delete-confirm-btn' : ''}`}
            onClick={handleConfirm}
          >
            {dialog.type === 'confirm' ? (dialog.confirmText || 'Confirm') : 'Got it'}

            
          </button>
        </div>

      </div>
    </div>
  );
};