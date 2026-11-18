// src/actions/taskActions.ts
import { ADD_TASK, SET_TASK_TYPES, } from '../types';
import type { Task, TaskType } from '../types';
import { generateId } from '../utils/dateUtils';

export const addTask = (
  datetime: string,
  task_details: string,
  task_type_id: string
) => {
  const newTask: Task = {
    id: generateId(),
    datetime,
    task_details,
    task_type_id,
  };

  return {
    type: ADD_TASK,
    payload: newTask,
  };
};

export const setTaskTypes = (taskTypes: TaskType[]) => ({
  type: SET_TASK_TYPES,
  payload: taskTypes,
});