// src/utils/dateUtils.ts

import type { Task } from "../types";

export const generateId = (): string => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
};

export const formatDateTime = (isoString: string): string => {
  return new Date(isoString).toLocaleString();
};

export const getCurrentDatetimeLocal = (): string => {
  const now = new Date();
  const offset = now.getTimezoneOffset();
  const local = new Date(now.getTime() - offset * 60 * 1000);
  return local.toISOString().slice(0, 16);
};

export const toLocalDateKey = (d: Date): string => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

  export const resolveOverlaps = (
  start: Date,
  end: Date,
  allTasks: Task[]
): { start: Date; end: Date } | null => {
  let adjustedStartMs = start.getTime();
  const endMs = end.getTime();
  
  // 1. Filter ONLY tasks on the same day to reduce the search space
  const targetDateStr = start.toDateString();
  const sameDayTasks = allTasks.filter(
    (t) => new Date(t.from_timestamp).toDateString() === targetDateStr
  );

  // 2. Sort them by start time so we check them in chronological order
  sameDayTasks.sort((a, b) => a.from_timestamp - b.from_timestamp);

  let hasOverlap = true;
  const ONE_MINUTE = 60 * 1000;

  while (hasOverlap) {
    hasOverlap = false;

    for (const task of sameDayTasks) {
      // Fast integer math. No new Date() needed here!
      if (adjustedStartMs < task.to_timestamp && endMs > task.from_timestamp) {
        
        // Push start to 1 minute after the existing task ends
        adjustedStartMs = task.to_timestamp + ONE_MINUTE; 
        
        if (adjustedStartMs >= endMs) {
          return null; // Doesn't fit within the requested end time
        }

        hasOverlap = true;
        break; // Re-check against all tasks with the new start time
      }
    }
  }

  return { 
    start: new Date(adjustedStartMs), 
    end: new Date(endMs) 
  };
};