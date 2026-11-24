import React, { useState, useRef, useEffect } from 'react';
import { Calendar, Lock } from 'lucide-react';

interface LockedDateProps {
  date: Date;
  onChange: (newDate: Date) => void;
  className?: string;
  displayFormat?: (date: Date) => string; // 👈 Add this
  hideIcons?: boolean;                    // 👈 Add this
}
 

export const LockedDate: React.FC<LockedDateProps> = ({ 
  date, onChange, className = '', displayFormat, hideIcons = false 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const displayText = displayFormat 
    ? displayFormat(date) 
    : `${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}`;
    
  const inputDate = date.toISOString().split('T')[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsEditing(false);
      }
    };
    if (isEditing) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isEditing]);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.value) return;
    const newDate = new Date(`${e.target.value}T12:00:00`);
    newDate.setHours(date.getHours(), date.getMinutes());
    onChange(newDate);
  };

  // 👇 Function to trigger the native picker when clicking our custom icon
  const openNativePicker = () => {
    if (inputRef.current) {
      try {
        inputRef.current.showPicker();
      } catch (err) {
        // Fallback for browsers that don't support showPicker()
        inputRef.current.focus();
      }
    }
  };

  return (
    <div ref={wrapperRef} className={`locked-date-wrapper ${className}`}>
      {isEditing ? (
        <div className="locked-date-editing-container">
          {/* 👇 Custom Calendar Icon on the Left */}
          <button 
            type="button" 
            className="custom-calendar-btn" 
            onClick={openNativePicker}
          >
            <Calendar size={14} />
          </button>
          
          {/* 👇 Native input, but styled to hide its own icon */}
          <input
            ref={inputRef}
            type="date"
            className="locked-date-input"
            defaultValue={inputDate}
            onChange={handleDateChange}
            autoFocus
            onBlur={(e) => {
              // Only close if the user didn't click our custom button
              if (!wrapperRef.current?.contains(e.relatedTarget as Node)) {
                setIsEditing(false);
              }
            }}
          />
        </div>
      ) : (
        <div 
          className="locked-date-display"
          onClick={() => setIsEditing(true)}
        >
          {/* Keep icons hidden only if explicitly asked (e.g., in the main header) */}
          {!hideIcons && <Calendar size={14} className="calendar-icon" />}
          <span>{displayText}</span>
          {!hideIcons && <Lock size={12} className="lock-icon" />}
        </div>
      )}
    </div>
  );
};