import React from 'react';
import './BlockingOverlay.css';

interface Props {
  isLoading: boolean;
  text?: string;
}

export const BlockingOverlay: React.FC<Props> = ({ isLoading, text = 'Saving...' }) => {
  if (!isLoading) return null;

  return (
    <div className="blocking-overlay-backdrop">
      <div className="blocking-overlay-content">
        <div className="blocking-spinner"></div>
        <span className="blocking-text">{text}</span>
      </div>
    </div>
  );
};