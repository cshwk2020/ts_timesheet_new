import React, { useState } from 'react';
import './StarRating.css';

interface StarRatingProps {
  value: number | null | undefined;
  onChange?: (value: number) => void;
  readonly?: boolean;
}

export const StarRating: React.FC<StarRatingProps> = ({ value = 0, onChange, readonly = false }) => {
  const [hoverValue, setHoverValue] = useState<number | null>(null);
  
  const displayValue = hoverValue !== null ? hoverValue : (value || 0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>, index: number) => {
    if (readonly) return;
    const { left, width } = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - left) / width;
    // If hovering over the left half, it's X.5, right half is X+1
    const starValue = percent < 0.5 ? index + 0.5 : index + 1;
    setHoverValue(starValue);
  };

  const handleClick = () => {
    if (readonly || !onChange || hoverValue === null) return;
    onChange(hoverValue);
  };

  const handleMouseLeave = () => {
    if (readonly) return;
    setHoverValue(null);
  };

  return (
    <div className={`star-rating ${readonly ? 'readonly' : ''}`} onMouseLeave={handleMouseLeave}>
      {[0, 1, 2, 3, 4].map((index) => {
        const fillPercentage = Math.max(0, Math.min(100, (displayValue - index) * 100));
        
        return (
          <div
            key={index}
            className="star-container"
            onMouseMove={(e) => handleMouseMove(e, index)}
            onClick={handleClick}
          >
            {/* Background Empty Star */}
            <span className="star empty">★</span>
            
            {/* Foreground Filled Star (clipped by width) */}
            <div className="star-fill-wrapper" style={{ width: `${fillPercentage}%` }}>
              <span className="star filled">★</span>
            </div>
          </div>
        );
      })}
      {!readonly && <span className="star-value">{displayValue > 0 ? displayValue.toFixed(1) : ''}</span>}
    </div>
  );
};