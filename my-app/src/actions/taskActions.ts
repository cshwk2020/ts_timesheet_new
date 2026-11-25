import { ADD_TASK_TYPE, UPDATE_TASK_TYPE, ADD_TASK, DELETE_TASK, SET_TASK_TYPES, UPDATE_TASK, TOGGLE_TASK_STATUS, type Task, type TaskType } from '../types';
import { generateId } from '../utils/dateUtils';

/**
 * Add a single task with a start and end time
 */
export const addTask = (
  from_datetime: string,
  to_datetime: string,
  task_details: string,
  task_type_id: string,
  status: 'planned' | 'done' 
) => {
  const newTask: Task = {
    id: generateId(),
    from_datetime,
    to_datetime,
    from_timestamp: new Date(from_datetime).getTime(),  
    to_timestamp: new Date(to_datetime).getTime(),   
    task_details,
    task_type_id,
    status
  };

  return {
    type: ADD_TASK,
    payload: newTask,
  };
};

export const updateTask = (updatedTask: Task) => {
  return {
    type: UPDATE_TASK,
    payload: updatedTask,
  };
};

export const deleteTask = (id: string) => ({
  type: DELETE_TASK,
  payload: id,
});

/**
 * Hydrate the task types into Redux (usually called once in App.tsx)
 */
export const setTaskTypes = (taskTypes: TaskType[]) => {
  return {
    type: SET_TASK_TYPES,
    payload: taskTypes,
  };
};


export const addTaskType = (name: string, color: string) => {
  const newType: TaskType = { id: generateId(), name, color };
  return { type: ADD_TASK_TYPE, payload: newType };
};

export const updateTaskType = (type: TaskType) => {
  return { type: UPDATE_TASK_TYPE, payload: type };
};


export const toggleTaskStatus = (id: string) => ({
  type: TOGGLE_TASK_STATUS,
  payload: id,
});