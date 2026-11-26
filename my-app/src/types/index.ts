// src/types/index.ts

 

// --- AUTH TYPES ---
export interface User {
  user_id: string;
  username: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}


export type AuthAction =
  | { type: 'AUTH_START' } // e.g., when logging in or checking storage
  | { type: 'AUTH_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'AUTH_FAILURE'; payload: string }
  | { type: 'AUTH_LOGOUT' }
  | { type: 'AUTH_INITIALIZED'; payload: { user: User; token: string } | null };




//
export interface CalendarState {
  currentDate: string;  
  viewMode: 'day' | 'week' | 'month';  
  isTaskTypeManagerOpen: boolean;     
}

export const SET_CURRENT_DATE = 'SET_CURRENT_DATE';
export const SET_VIEW_MODE = 'SET_VIEW_MODE';
export const TOGGLE_TASK_TYPE_MANAGER = 'TOGGLE_TASK_TYPE_MANAGER';

 

interface SetCurrentDateAction {
  type: typeof SET_CURRENT_DATE;
  payload: string; // ISO string
}

interface SetViewModeAction {
  type: typeof SET_VIEW_MODE;
  payload: 'day' | 'week' | 'month';
}

interface ToggleTaskTypeManagerAction {
  type: typeof TOGGLE_TASK_TYPE_MANAGER;
  payload: boolean;
}
 



 

 
// Action Types
export const ADD_TASK = 'ADD_TASK';
export const SET_TASK_TYPES = 'SET_TASK_TYPES';   // 👈 new: hydrate types from DB
export const UPDATE_TASK = 'UPDATE_TASK';
export const DELETE_TASK = 'DELETE_TASK';
export const ADD_TASK_TYPE = 'ADD_TASK_TYPE';
export const UPDATE_TASK_TYPE = 'UPDATE_TASK_TYPE';
export const TOGGLE_TASK_STATUS = 'TOGGLE_TASK_STATUS';
 


/**
 * A task type as it will exist in the DB.
 * - `id` is the PK (could be uuid, int, slug — keep as string for flexibility)
 * - `name` is the human-readable label
 */
export interface TaskType {
  id: string;
  name: string;
  color?: string;
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
  status: 'planned' | 'done';
}


// 
export interface TaskState {
  tasks: Task[];
  taskTypes: TaskType[];     // 👈 also keep the list in Redux
}

//
export interface ToggleTaskStatusAction {
  type: typeof TOGGLE_TASK_STATUS;
  payload: string; // Task ID
}




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

interface AddTaskTypeAction {
  type: typeof ADD_TASK_TYPE;
  payload: TaskType;
}

interface UpdateTaskTypeAction {
  type: typeof UPDATE_TASK_TYPE;
  payload: TaskType;
}

//
export type TaskAction = AddTaskAction | SetTaskTypesAction | UpdateTaskAction | DeleteTaskAction | AddTaskTypeAction | UpdateTaskTypeAction | ToggleTaskStatusAction;




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

export type AppActionTypes = TaskAction
  | SetErrorAction 
  | ClearErrorAction 
  | ShowDialogAction 
  | HideDialogAction 
  | SetCurrentDateAction 
  | SetViewModeAction 
  | ToggleTaskTypeManagerAction 
  | SetCurrentDateAction
  | TaskAction
  | AuthAction;




 
