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
export interface Task {
  id: string;
  datetime: string;          // ISO string
  task_details: string;
  task_type_id: string;      // FK → TaskType.id
}

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