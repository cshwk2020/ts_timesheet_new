// src/types/index.ts


export interface CalendarState {
  currentDate: string; // Store as ISO string in Redux
}

export const SET_CURRENT_DATE = 'SET_CURRENT_DATE';

interface SetCurrentDateAction {
  type: typeof SET_CURRENT_DATE;
  payload: string; // ISO string
}


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


// 

export interface TaskState {
  tasks: Task[];
  taskTypes: TaskType[];     // 👈 also keep the list in Redux
}

// Action Types
export const ADD_TASK = 'ADD_TASK';
export const SET_TASK_TYPES = 'SET_TASK_TYPES';   // 👈 new: hydrate types from DB
export const UPDATE_TASK = 'UPDATE_TASK';
export const DELETE_TASK = 'DELETE_TASK';

 
 

// Action Interfaces
export interface AddTaskAction {
  type: typeof ADD_TASK;
  payload: Task;
}

export interface SetTaskTypesAction {
  type: typeof SET_TASK_TYPES;
  payload: TaskType[];
}


export interface UpdateTaskAction {
  type: typeof UPDATE_TASK;
  payload: Task; // The fully updated task
}

interface DeleteTaskAction {
  type: typeof DELETE_TASK;
  payload: string; // The task ID
}

//
export type TaskActionTypes = AddTaskAction | SetTaskTypesAction | UpdateTaskAction | DeleteTaskAction;



// ERROR Actions

export interface ErrorState {
  message: string | null;
}

export const SET_ERROR = 'SET_ERROR';
export const CLEAR_ERROR = 'CLEAR_ERROR';

export interface SetErrorAction {
  type: typeof SET_ERROR;
  payload: string;
}

export interface ClearErrorAction {
  type: typeof CLEAR_ERROR;
}
 


// dialog

export interface DialogState {
  isOpen: boolean;
  title: string;
  message: string;
  type: 'error' | 'confirm';
  confirmText?: string; // e.g., "Delete", "Save", "Yes"
  onConfirm?: (() => void) | null; // 👈 The callback function!
}



export const SHOW_DIALOG = 'SHOW_DIALOG';
export const HIDE_DIALOG = 'HIDE_DIALOG';

interface ShowDialogAction {
  type: typeof SHOW_DIALOG;
  payload: Omit<DialogState, 'isOpen'>;
}

interface HideDialogAction {
  type: typeof HIDE_DIALOG;
}


// ALL Actions

export type AppActionTypes = TaskActionTypes | SetErrorAction | ClearErrorAction | ShowDialogAction | HideDialogAction | SetCurrentDateAction;