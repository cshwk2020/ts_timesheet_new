import { ADD_TASK, DELETE_TASK, SET_TASK_TYPES, UPDATE_TASK, type Task, type TaskType } from '../types';
import { generateId } from '../utils/dateUtils';

/**
 * Add a single task with a start and end time
 */
export const addTask = (
  from_datetime: string,
  to_datetime: string,
  task_details: string,
  task_type_id: string
) => {
  const newTask: Task = {
    id: generateId(),
    from_datetime,
    to_datetime,
    from_timestamp: new Date(from_datetime).getTime(),  
    to_timestamp: new Date(to_datetime).getTime(),   
    task_details,
    task_type_id,
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

