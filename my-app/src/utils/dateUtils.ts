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

 
 
export const checkTaskOverlap = (
  start: Date,
  end: Date,
  allTasks: Task[],
  editingTaskId?: string
): { hasOverlap: boolean; conflictingTask?: Task } => {
  
  const startMs = start.getTime();
  const endMs = end.getTime();

  // Filter tasks to check: Exclude self (if editing) and exclude tasks on other days
  const targetStart = new Date(start);
  targetStart.setHours(0, 0, 0, 0);
  const targetEnd = new Date(start);
  targetEnd.setHours(23, 59, 59, 999);

  const tasksToCheck = allTasks.filter((t) => {
    if (t.id === editingTaskId) return false; // Phase 1 & 2 combined: Skip self
    // Only check tasks that fall on this specific day
    return t.from_timestamp <= targetEnd.getTime() && t.to_timestamp >= targetStart.getTime();
  });

  // Strict Intersection Check:
  // If (NewStart < ExistingEnd) AND (NewEnd > ExistingStart), they overlap.
  const conflictingTask = tasksToCheck.find((t) => {
    return startMs < t.to_timestamp && endMs > t.from_timestamp;
  });

  if (conflictingTask) {
    return { hasOverlap: true, conflictingTask };
  }

  return { hasOverlap: false };
};


export const resolveOverlaps = (
  start: Date,
  end: Date,
  allTasks: Task[],
  editingTaskId?: string
): { start: Date; end: Date; error?: string } => {
  const ONE_MINUTE = 60 * 1000;
  
  // 1. Get the 24-hour day window for the new Start Date
  const targetStart = new Date(start);
  targetStart.setHours(0, 0, 0, 0);
  const targetEnd = new Date(start);
  targetEnd.setHours(23, 59, 59, 999);
  
  // 2. Filter tasks that intersect with this day
  const dayTasks = allTasks.filter(t => 
    t.from_timestamp <= targetEnd.getTime() && t.to_timestamp >= targetStart.getTime()
  );

  // ==========================================
  // PHASE 1: Check against NON-EDIT tasks
  // ==========================================
  const otherTasks = dayTasks
    .filter(t => t.id !== editingTaskId)
    .sort((a, b) => a.from_timestamp - b.from_timestamp);
  
  let adjustedStartMs = start.getTime();
  const endMs = end.getTime();

  let hasOverlap = true;
  while (hasOverlap) {
    hasOverlap = false;
    for (const task of otherTasks) {
      if (adjustedStartMs < task.to_timestamp && endMs > task.from_timestamp) {
        
        adjustedStartMs = task.to_timestamp + ONE_MINUTE;
        
        if (adjustedStartMs >= endMs) {
           return { 
             start: new Date(adjustedStartMs), 
             end: new Date(endMs), 
             error: "Conflict with an existing task. Cannot fit." 
           };
        }
        hasOverlap = true;
        break;
      }
    }
  }

  // ==========================================
  // PHASE 2: Check against EDIT task (Self-Ban)
  // ==========================================
  if (editingTaskId) {
    const editTask = dayTasks.find(t => t.id === editingTaskId);
    
    if (editTask) {
      // Note: Because we are *replacing* the task, normally we would ignore its old time.
      // BUT if your business logic requires the new time to not intersect the old time 
      // (e.g., you are treating it like a "move" rather than an "overwrite"), you check here.
      
      // If you want to strictly ensure the new time doesn't overlap the OLD time:
      /*
      if (adjustedStartMs < editTask.to_timestamp && endMs > editTask.from_timestamp) {
        return {
           start: new Date(adjustedStartMs),
           end: new Date(endMs),
           error: "The new time overlaps with the old time of this task."
        }
      }
      */
      
      // Actually, if we just want to prevent "Self-Ban" blocking a valid move, 
      // we don't need to do anything here. The `adjustedStartMs` is clean from Phase 1.
      // Redux will overwrite the old task with the new time.
    }
  }

  return { 
    start: new Date(adjustedStartMs), 
    end: new Date(endMs) 
  };
};



/*
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
*/

