import type { Middleware, UnknownAction } from '@reduxjs/toolkit';

let overlayStartTime = 0;
const MIN_DURATION = 500; // 500ms sliding window

export const overlayMiddleware: Middleware = (store: any) => (next) => (action) => {
  // 1. When overlay is shown, record the time
  const typedAction = action as UnknownAction; // or `as { type: string; payload?: any }`

  if (typedAction.type === 'SHOW_GLOBAL_OVERLAY') {
    overlayStartTime = Date.now();
    return next(action);
  }

  // 2. When hide is requested, check the sliding window
  if (typedAction.type === 'HIDE_GLOBAL_OVERLAY') {
    const elapsed = Date.now() - overlayStartTime;
    
    if (elapsed < MIN_DURATION) {
      // Too fast! Delay the hide action.
      const remainingTime = MIN_DURATION - elapsed;
      setTimeout(() => {
        next(action); // Pass to reducer after the delay
      }, remainingTime);
      return; // Stop the action from hitting the reducer immediately
    }
  }

  // 3. All other actions pass through immediately
  return next(action);
};