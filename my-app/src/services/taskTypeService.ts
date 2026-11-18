// src/services/taskTypeService.ts
import { type TaskType } from '../types';

/**
 * In production this becomes:
 *   const res = await fetch('/api/task-types');
 *   return res.json();
 */
export const fetchTaskTypes = async (): Promise<TaskType[]> => {
  // Mock DB response
  return [
    { id: 'work',     name: 'Work' },
    { id: 'personal', name: 'Personal' },
    { id: 'urgent',   name: 'Urgent' },
  ];
};