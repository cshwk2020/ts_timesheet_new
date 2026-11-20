import React from 'react';
import './ErrorModal.css'; // We'll create this next

interface ErrorModalProps {
  message: string | null;
  onClose: () => void;
}

export const ErrorModal: React.FC<ErrorModalProps> = ({ message, onClose }) => {
  // If there is no message, render nothing
  if (!message) return null;

  return (
    <div className="error-modal-backdrop" onClick={onClose}>
      <div 
        className="error-modal-box" 
        onClick={(e) => e.stopPropagation()} // Prevent clicking inside the box from closing it
      >
        <div className="error-icon">⚠️</div>
        <h3 className="error-title">Scheduling Conflict</h3>
        <p className="error-text">{message}</p>
        <button 
          className="error-close-btn" 
          onClick={onClose}
        >
          Got it
        </button>
      </div>
    </div>
  );
};