// src/types/index.ts

/**
 * A task type as it will exist in the DB.
 * - `id` is the PK (could be uuid, int, slug — keep as string for flexibility)
 * - `name` is the human-readable label
 */
export interface TaskType {
  id: string;
  name: string;
}

/**
 * Task as stored in DB / Redux.
 * `task_type_id` is a FK to TaskType.id
 */
// src/types/index.ts

export interface Task {
  id: string;
  from_datetime: string; // Keep for UI formatting
  to_datetime: string;   // Keep for UI formatting
  from_timestamp: number; // 👈 Fast checking
  to_timestamp: number;   // 👈 Fast checking
  task_details: string;
  task_type_id: string;
}


// ... rest of your types (TaskState, actions, etc.)

export interface TaskState {
  tasks: Task[];
  taskTypes: TaskType[];     // 👈 also keep the list in Redux
}

// Action Types
export const ADD_TASK = 'ADD_TASK';
export const SET_TASK_TYPES = 'SET_TASK_TYPES';   // 👈 new: hydrate types from DB

// Action Interfaces
interface AddTaskAction {
  type: typeof ADD_TASK;
  payload: Task;
}

interface SetTaskTypesAction {
  type: typeof SET_TASK_TYPES;
  payload: TaskType[];
}

export type TaskActionTypes = AddTaskAction | SetTaskTypesAction;